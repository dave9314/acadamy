const fs = require('fs')
const path = require('path')

function checkPageSyntax() {
  console.log('🔍 Checking page syntax and structure...\n')
  
  const pages = [
    'app/page.tsx',
    'app/auth/login/page.tsx', 
    'app/dashboard/page.tsx',
    'app/admin/page.tsx',
    'app/request/page.tsx'
  ]
  
  pages.forEach(pagePath => {
    console.log(`📄 Checking ${pagePath}...`)
    
    try {
      if (!fs.existsSync(pagePath)) {
        console.log(`❌ File not found: ${pagePath}`)
        return
      }
      
      const content = fs.readFileSync(pagePath, 'utf8')
      
      // Basic syntax checks
      const issues = []
      
      // Check for export default
      if (!content.includes('export default')) {
        issues.push('Missing export default')
      }
      
      // Check for 'use client' if using hooks
      if ((content.includes('useState') || content.includes('useEffect')) && !content.includes("'use client'")) {
        issues.push("Missing 'use client' directive")
      }
      
      // Check for balanced brackets
      const openBraces = (content.match(/{/g) || []).length
      const closeBraces = (content.match(/}/g) || []).length
      if (openBraces !== closeBraces) {
        issues.push(`Unbalanced braces: ${openBraces} open, ${closeBraces} close`)
      }
      
      // Check for balanced parentheses in JSX
      const jsxStart = content.indexOf('return (')
      if (jsxStart !== -1) {
        const jsxContent = content.substring(jsxStart)
        const openParens = (jsxContent.match(/\(/g) || []).length
        const closeParens = (jsxContent.match(/\)/g) || []).length
        if (openParens !== closeParens) {
          issues.push(`Unbalanced parentheses in JSX: ${openParens} open, ${closeParens} close`)
        }
      }
      
      if (issues.length === 0) {
        console.log('✅ Syntax looks good')
      } else {
        console.log('❌ Issues found:')
        issues.forEach(issue => console.log(`   - ${issue}`))
      }
      
    } catch (error) {
      console.log(`❌ Error reading file: ${error.message}`)
    }
    
    console.log('')
  })
  
  // Check key dependencies
  console.log('📦 Checking package.json dependencies...')
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    const requiredDeps = [
      'next-auth',
      'react',
      'next',
      '@prisma/client',
      'framer-motion',
      'lucide-react',
      'react-hot-toast'
    ]
    
    const missing = requiredDeps.filter(dep => 
      !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
    )
    
    if (missing.length === 0) {
      console.log('✅ All required dependencies present')
    } else {
      console.log('❌ Missing dependencies:', missing.join(', '))
    }
    
  } catch (error) {
    console.log('❌ Error reading package.json:', error.message)
  }
  
  console.log('\n🎯 Page check complete!')
}

checkPageSyntax()