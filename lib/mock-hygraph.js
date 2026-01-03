// Temporary mock that matches Hygraph GraphQL responses
export const mockHygraphData = {
  siteSettings: {
    meta: {
      title: "McKim Design Group - Architecture & Design",
      description: "McKim Design Group is a highly-regarded full-service architecture firm located in San Jose, California.",
      keywords: "architecture, design, construction, San Jose, California, K-12, educational, residential, commercial"
    },
    branding: {
      companyName: "McKim Design Group",
      companyFullName: "McKim Design Group",
      desktopLogo: null,
      mobileLogo: { url: "/img/logo.png" },
      favicon: { url: "/favicon.ico" },
      primaryColor: "#7819B1",
      fontHeading: "Montserrat",
      fontBody: "Lato"
    },
    contact: {
      address: "4595 Cherry Avenue First Floor, San Jose, CA 95118",
      phone: "408.927.8110",
      fax: "408.927.8112",
      email: "kmckim@mckimdesign.com"
    },
    projects: {
      categoryOrder: "Educational,Residential,Commercial"
    }
  }
}