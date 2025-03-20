// Import the required modules
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs"

// Replace with your actual API key
const API_KEY = "";
const genAI = new GoogleGenerativeAI(API_KEY);



//Data 

//profile - Generated For
const generatedByProfiles = {
  "EcommerceMerchant": {
    "CompanyName": "Richer sounds",
    "EcommercePlatform": "BigCommerce",
    "TargetMarket": "europe"
  },
  "WebAgency": {
    "AgencyName": "{__Agency Name__}",
    "YearsInBusiness": "{__Years In business__}",
    "ClientPortfolio": "{__Client Portfolio__}",
    "EcommerceFocus": "{__Ecommerce Focus__}",
    "TargetMarket": "{__Target Market__}",
    "ServicesOffered": "{__Services Offered__}"
  },
  "EcommercePlatform": {
    "EnterpriseMerchantName": "{__Enterprise Merchant Name__}",
    "EcommerceFocus": "{__Ecommerce Focus__}"
  }
};
  //Input Data From Opensearch
const Inputdata = `Total No of Order:
In Last 7 days: Average of 20 and Total of 139

Total Sales:
In Last 7 days: Average of £ 3,206.77 and Total of £ 22,447.37

Number of orders with discount applied:
In Last 7 days: Average of 1 and Total of 6

Amount of Discount Used:
In Last 7 days: Average of £ 16.72 and Total of £ 117.01

Average Order Value:
In Last 7 days: Average of £ 161.49 and Total of £ 161.49

Total Shipping Cost:
In Last 7 days: Average of £ 43.48 and Total of £ 304.39

Total # of orders with Shipping > 0:
In Last 7 days: Average of 9 and Total of 61

Customer Registered:
In Last 7 days: Average of 10 and Total of 67

Customers Ordered:
In Last 7 days: Average of 14 and Total of 100

Refund number of orders:
In Last 7 days: Average of 0 and Total of 2

Refund Order Value:
In Last 7 days: Average of £ 7.12 and Total of £ 49.86

Number of orders Partially Refunded:
In Last 7 days: Average of 0 and Total of 2

Partially Refunded Order Value:
In Last 7 days: Average of £ 7.12 and Total of £ 49.86

Dates Mentioned In the Data : Today is 20/03/2025
Last 7 days is (13/03/2025 - 20/03/2025)




Dates Mentioned In the Data :

Today is 18-03-2025
Last 7 days is (11/03/2025 - 18/03/2025)
`;
//optional Fields Selections
const optional_sections = 
    
    [
      {
        title: "Executive Summary",
        description: "Summarise the report's purpose, highlighting the use of Vortex IQ’s AI Reasoning Model to derive insights and actionable recommendations.\n"
      },
      {
        title: "Your Store KPIs",
        description: "Convert the input data into a table with 2 columns: KPI Name, Last 7 days, summarizing values for each time period accordingly with Average and Total values in each cell with this format: Average: {Value}, Total: {Value}.\n"
      },
      {
        title: "Competitive Benchmarking",
        description: "For Benchmarking: Use what industry standard these days. Include relevant sections like Website Sales Performance, Pricing Analysis, Digital Shelf Performance, and any other sections you think are relevant to the data in the input data. Base your Benchmarking ONLY on the data provided. Do not include sections that are not relevant to the data provided and if there’s no relevant data provided for any sections below, omit the section from the report.\n"
      }
    ];






    //Controls
const desiredTitles =  ["Executive Summary","Competitive Benchmarking","Your Store KPIs"];
const reportTitle = "Actionable Insights Report"
const generatedBy = ["EcommerceMerchant"];
const formattedProfiles = getFormattedProfiles(generatedBy);
const challengesFacebyGB=`Drive adoption of all features, apps and cross / upsell to drive sales and operational efficiency.Slower site load times affecting conversions,High checkout abandonment rates, Need for AI-driven merchandising & personalisation, Optimising for mobile-first shopping experience, Implementing advanced SEO strategies for organic growth`
const generatedFor =  "Web Developer - Web agency"
const challengesFacebyGF = `Aligning client needs with AI-powered solutions. Ensuring seamless platform integrations and technical scalability, Improving client site speed and performance metrics.Meeting client deadlines without compromising on quality  `
const selectedSections = getFormattedSections(desiredTitles);






    function getFormattedSections(desiredTitles) {
      return optional_sections
        .filter(section => desiredTitles.includes(section.title))
        .map(section => {
          // Format title: Capitalize each word
          const formattedTitle = section.title.replace(/\b\w/g, char => char.toUpperCase());
    
          // Format description: Capitalize first letter and ensure it ends with a period
          let formattedDescription = section.description.trim();
          if (!formattedDescription.endsWith('.')) {
            formattedDescription += '.';
          }
          formattedDescription = formattedDescription.charAt(0).toUpperCase() + formattedDescription.slice(1);
    
          return `${formattedTitle}: ${formattedDescription}`;
        });
    }
    function getFormattedProfiles(selectedProfileKeys) {
      return selectedProfileKeys.map(profileKey => {
        const profile = generatedByProfiles[profileKey];
        if (!profile) return '';
    
        const formattedProfile = Object.entries(profile)
          .map(([key, value]) => `- ${key.replace(/([A-Z])/g, ' $1').trim()} : ${value}`)
          .join('\n');
    
        return `${profileKey.replace(/([A-Z])/g, ' $1').trim()}:\n${formattedProfile}`;
      }).join('\n\n');
    }
    function extractGeneratedContent(response) {
      let htmlContent = '';
      try {
        if (Array.isArray(response)) {
          let res = response[0].content.parts[0].text;
    
          // Define the new styles
          const newStyles = `
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
        }
            header {
              text-align: left;
              padding-bottom: 20px;
              border-bottom: 2px solid #eee;
            }
            h1 {
              color: #0056b3;
              text-align: center;
            }
            h2 {
              color: #0056b3;
              margin-top: 25px;
              margin-bottom: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f4f4f4;
              font-weight: bold;
            }
            .priority-high {
              color: red;
            }
            .priority-medium {
              color: orange;
            }
            .priority-low {
              color: green;
            }
            footer {
              margin-top: 30px;
              padding-top: 10px;
              border-top: 2px solid #eee;
              text-align: center;
              color: #777;
              font-size: small;
            }
            ul {
              list-style-type: square;
              padding-left: 20px;
            }
          `;
    
          // Replace the contents of the <style> tag
          res = res.replace(/<style>[\s\S]*?<\/style>/, `<style>${newStyles}</style>`);
    
          fs.writeFileSync("generated_content.html", res, "utf8");
        } else {
          console.log("Unexpected response format:", response);
        }
      } catch (error) {
        console.error("Error extracting content:", error);
      }
    
      console.log("HTML report has been successfully written to 'generated_content.html'.");
    }







async function main() {
  try {
    // Specify the correct model name for Gemini 2.0 Flash Thinking Experimental
    const modelName = "gemini-2.0-flash-thinking-exp";
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: modelName });
    // Define the input prompt in the correct format
    const prompt = [
      {
        role: "user",
        parts: [
          {
            text: `
      ## Prompt: Generate an AI-Powered Actionable Insights Report for an E-commerce Merchant
      ### Context:
      We are using the Vortex IQ AI Insights Report Generator to create a detailed, data-driven report for an e-commerce merchant. The report should leverage all available data points, including sales performance, customer behavior, marketing insights, site performance, and operational metrics. The report is targeted at the Head of Ecommerce and aims to provide actionable recommendations to optimize business performance.
      ### Report Parameters:
      - Report Title: ${reportTitle}
      - Report is Generated By : ${generatedBy}
        Ecommerce Merchant Profile : 
        ${formattedProfiles}
      - Challenges Faced By ${generatedBy} :  ${challengesFacebyGB}
      - Report is Generated For : ${generatedFor}
      - Challenges Faced By ${generatedFor} : ${challengesFacebyGF}

    ### Input Data : 

      ${Inputdata}

    ### Required Sections:

        1. Report Parameters: Include Company name, Industry, Who is it Generated For and Generated By (Do not Include Challenges and Profiles)
        
        2. Action Plan - AI-Powered Recommendations:
        Create 9 tables based on the Effort vs. Impact Analysis framework. 
        Each table corresponds to one of the following categories: High Impact-Low Effort, High Impact-Medium Effort, High Impact-High Effort, Medium Impact-Low Effort, Medium Impact-Medium Effort, Medium Impact-High Effort, Low Impact-Low Effort, Low Impact-Medium Effort, and Low Impact-High Effort.
        For each table:
        Include rows only if there is sufficient input data to support actionable recommendations.
        For Recommendations, It should be supported by Input Data
        Use the following columns: Action, Priority, Effort Level, Impact Level, and Expected Uplift.
        In  Expected Uplift (Mention Expected Uplift Percentage and Expected Revenue)
        If no data supports recommendations for a category, state 'None' in All columns .
        Base all recommendations solely on the provided data and consider challenges faced by stakeholders.





    ### Optional Sections to Include if User Selects: 

        ${selectedSections}

    ### Formatting & Presentation:

        - Include all ${(desiredTitles.length ) + 3} sections mentioned in this order  : Header , Action Plan, ${desiredTitles}, Conclusion    
        - Use a professional and clean layout, incorporating charts and tables where applicable.
        - The report is for : Web Developer - Web Agency. Use the insights, Report, Recommendations accordingly. 
        - No Hallucinations, Ground the report with the data you’ve been provided. 

    ### Tone & Style:

        - Maintain a professional and data-driven tone, suitable for Web Developer - Web Agency.
        - Ensure the report is easy to navigate, with clear headings and section dividers.
        - Use bullet points and short paragraphs to enhance readability.
        - Align the headings on the left

    ### Output Format:

        Generate the report in HTML format, mimicking a Word document/PDF layout. Follow these guidelines:
      - Use only valid HTML
      - Start with an <html> tag and end with a </html> tag
      - Use proper HTML nesting for readability
      - Include <style> Tag with Zero CSS. Do not Include CSS of any Sorts
      - Do not include header or footer content
      - Do not Add Colors of any sorts


    ### Additional Instructions:

      - Use the provided data points and insights to ensure the final output is highly actionable and tailored to the Head of E-commerce's role.
      - Include specific metrics from the dataset in recommendations.
      - Do not include a section that’s Irrelevant to the data.
      - Follow UK Date Format, for all the dates in the report. For Example : 20-FEB-2025


    ### HTML Skeleton : 

        Follow the Following HTML Skeleton :
        <!doctypehtml><html lang=en><meta charset=UTF-8><meta content="width=device-width,initial-scale=1"name=viewport><title>[Report Title]</title><style>/**DO NOT APPLY CSS**/</style><div class=container><header>[INSERT Report Parameters Here]</header>
        <section id=section-namey><h2>section name</h2><p>[Section Content]</section>
        <footer><p>[Report Generation Information]</footer></div>

`,
          },
        ],
      },
    ];
    console.log(prompt[0].parts[0].text);
    // Generate content using the specified model
    const result = await model.generateContent({
      contents: prompt,
      generationConfig: {
        temperature: 0.3, // Adjust temperature for creativity
        maxOutputTokens: 8000, // Limit output tokens as needed
        topP: 0.95, // Adjust topP for randomness
      },
    });
    const data = await result.response.candidates;
   
    extractGeneratedContent(data);
    //console.log("Generated Text:", generatedText);
  } catch (error) {
    console.error("Error generating content:", error);
  }
}



// Run the main function
main();
