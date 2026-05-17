import axios from "axios";
import {tool} from "langchain"
import * as z from "zod";


export const listFiles = tool(
    async({},config)=>{

        const sandboxId = config?.configurable?.sandboxId;


        console.log("============================================================================");
        

        console.log("Listing All the File in the working directory");

        console.log("============================================================================");

        const response = await axios.get(`http://sandbox-service-${sandboxId}:3000/list-files`)

        console.log(response.data);
        
       

        console.log("============================================================================");


        console.log("Responding to the Api Request");


        console.log("============================================================================");

        return JSON.stringify(response.data.files)

    },
    {
        name:"list-files",
        description:"lists all the files and folders in the Project Directory including  the sub-directories . this is Useful for checking the files and folders in the project directory.",
        schema: z.object({
            paths: z.array(z.string()).optional()
        })
    }
)


export const readFile = tool(
    async({files}, config)=>{


        const sandboxId = config?.configurable?.sandboxId;

        console.log("============================================================================");


        console.log("Reading the File "+files);


         console.log("============================================================================");
        

        const response = await axios.get(`http://sandbox-service-${sandboxId}:3000/read-file?files=${files.join(",")}`)

        console.log(response.data);



        console.log("============================================================================");



        console.log("Responding to the Api Request",response.data);
        
        console.log("============================================================================");


        
        return JSON.stringify(response.data.data)
    },
    {
        name:"read-file",
        description:"Reads the specified file from the Project Directory. Use this tool to read the content of a file.",
        schema: z.object({
            files: z.array(z.string()).describe("an array of file paths to read")
        })
    }
)


export const updateFile = tool(
    async({files}, config)=>{


        const sandboxId = config?.configurable?.sandboxId;

        console.log("============================================================================");
        
        console.log("Updating the File "+ files);

        console.log("============================================================================");


        const response = await axios.patch(`http://sandbox-service-${sandboxId}:3000/update-file`,{
            updates:files
        })


    
        

        console.log("====================================================================================");

        console.log("Responding to the Api Request", response.data);
        
        console.log("====================================================================================");  

        return JSON.stringify(response.data.results)

         
    },
    {
        name:"update-file",
        description:"Updates the specified content to the specified file in the Project Directory. Use this tool to update the content of a file.",
       schema: z.object({
          files: z.array(
            z.object({
               filePath: z.string().describe("Path to the file to update"),
               content: z.string().describe("Content to write to the file")
        })
    )
})
    }
)


export const createFile = tool(
    async({files}, config)=>{


        const sandboxId = config?.configurable?.sandboxId;

        console.log("============================================================================");

         console.log("Creating the File "+files);


         console.log("============================================================================");
        

        const response = await axios.post(`http://sandbox-service-${sandboxId}:3000/create-file`,{
            files:files
        })

        
        console.log("====================================================");
        
       

        console.log("Responding to the Api Request", response.data);
        
        console.log("============================================================================");
        

        
        return JSON.stringify(response.data.data)
    },
    {
        name:"create-file",
        description:"Creates the specified file with the specified content in the Project Directory. Use this tool to create new files.",
        schema: z.object({
            files: z.array(z.object({
                filePath: z.string().describe("Path to the file to create"),
                content: z.string().describe("Content to write to the file")
            })).describe("an array of file paths and content to create")
        })
    }
)
