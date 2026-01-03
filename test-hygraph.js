require('dotenv').config({ path: '.env.local' })

async function testHygraphConnection() {
  try {
    const response = await fetch(process.env.HYGRAPH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HYGRAPH_TOKEN}`,
      },
      body: JSON.stringify({
        query: `
          query TestNewProjectStructure {
            pageProjectsPlural {
              id
              category
              projectList {
                id
                title
                slug
                location
                year
              }
            }
          }
        `
      }),
    })

    const { data, errors } = await response.json()
    console.log('Raw response:', JSON.stringify({ data, errors }, null, 2))

    if (errors) {
      console.error('❌ GraphQL Errors:', errors)
      return
    }

    if (data?.__schema?.queryType?.fields) {
      console.log('✅ Available GraphQL fields:')
      data.__schema.queryType.fields
        .filter(field => field.name.toLowerCase().includes('page') || field.name.toLowerCase().includes('site') || field.name.toLowerCase().includes('team') || field.name.toLowerCase().includes('project'))
        .forEach(field => {
          console.log(`  - ${field.name}`)
        })
    } else {
      console.log('⚠️ Could not get schema fields')
      console.log('Available data:', data)
    }

  } catch (error) {
    console.error('❌ Connection failed:', error.message)
  }
}

testHygraphConnection()