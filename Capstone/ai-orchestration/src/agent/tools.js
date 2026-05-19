import axios from "axios";
import { tool } from "langchain"
import * as z from "zod";

function writeProgress(config, message) {
    const writer = config?.writer || config?.configurable?.writer;
    if (writer && typeof writer.write === "function") {
        try {
            writer.write(message);
        } catch (e) {
            console.error("Error writing progress:", e);
        }
    }
}

// -------------------------------------------------------------
// 1. LIST FILES (Logic and Tool Definitions)
// -------------------------------------------------------------
const listFilesFn = async ({ }, config) => {
    const sandboxId = config?.configurable?.sandboxId;
    writeProgress(config, `Listing Files in the project directory...\n`);
    
    const response = await axios.get(`http://sandbox-service-${sandboxId}:3000/list-files`);
    
    writeProgress(config, `Listing Files Successfully...\n`);
    return JSON.stringify(response.data.files);
};

export const listFiles = tool(listFilesFn, {
    name: "list-files",
    description: "lists all the files and folders in the Project Directory including the sub-directories. this is Useful for checking the files and folders in the project directory.",
    schema: z.object({
        paths: z.array(z.string()).optional()
    })
});

export const listFilesUnderscore = tool(listFilesFn, {
    name: "list_files",
    description: listFiles.description,
    schema: listFiles.schema
});

// -------------------------------------------------------------
// 2. READ FILES (Logic and Tool Definitions)
// -------------------------------------------------------------
const readFilesFn = async ({ files }, config) => {
    const sandboxId = config?.configurable?.sandboxId;
    writeProgress(config, `Reading Files in the project directory...\n`);

    const response = await axios.get(`http://sandbox-service-${sandboxId}:3000/read-file?files=${files.join(",")}`);

    writeProgress(config, `Reading Files Successfully...\n`);
    return JSON.stringify(response.data.data);
};

export const readFiles = tool(readFilesFn, {
    name: "read-file",
    description: "Reads the specified file or files from the Project Directory. Use this tool to read the contents of one or more files.",
    schema: z.object({
        files: z.array(z.string()).describe("an array of file paths to read")
    })
});

export const readFilesUnderscore = tool(readFilesFn, {
    name: "read_files",
    description: readFiles.description,
    schema: readFiles.schema
});

export const readFileHyphen = tool(readFilesFn, {
    name: "read-files",
    description: readFiles.description,
    schema: readFiles.schema
});

export const readSingleFileUnderscore = tool(readFilesFn, {
    name: "read_file",
    description: readFiles.description,
    schema: readFiles.schema
});

// -------------------------------------------------------------
// 3. UPDATE FILES (Logic and Tool Definitions)
// -------------------------------------------------------------
const updateFileFn = async ({ files }, config) => {
    const sandboxId = config?.configurable?.sandboxId;
    writeProgress(config, `Updating Files in the project directory...\n`);

    const response = await axios.patch(`http://sandbox-service-${sandboxId}:3000/update-file`, {
        updates: files
    });

    writeProgress(config, `Updated Files Successfully...\n`);
    return JSON.stringify(response.data.results);
};

export const updateFile = tool(updateFileFn, {
    name: "update-file",
    description: "Updates the specified content to the specified file or files in the Project Directory. Use this tool to update the contents of files.",
    schema: z.object({
        files: z.array(
            z.object({
                filePath: z.string().describe("Path to the file to update"),
                content: z.string().describe("Content to write to the file")
            })
        )
    })
});

export const updateFileUnderscore = tool(updateFileFn, {
    name: "update_files",
    description: updateFile.description,
    schema: updateFile.schema
});

export const updateFileHyphen = tool(updateFileFn, {
    name: "update-files",
    description: updateFile.description,
    schema: updateFile.schema
});

export const updateSingleFileUnderscore = tool(updateFileFn, {
    name: "update_file",
    description: updateFile.description,
    schema: updateFile.schema
});

// -------------------------------------------------------------
// 4. CREATE FILES (Logic and Tool Definitions)
// -------------------------------------------------------------
const createFileFn = async ({ files }, config) => {
    const sandboxId = config?.configurable?.sandboxId;
    writeProgress(config, `Creating Files in the project directory...\n`);

    const response = await axios.post(`http://sandbox-service-${sandboxId}:3000/create-file`, {
        files: files
    });

    writeProgress(config, `Created Files Successfully...\n`);
    return JSON.stringify(response.data.data);
};

export const createFile = tool(createFileFn, {
    name: "create-file",
    description: "Creates the specified file with the specified content in the Project Directory. Use this tool to create new files.",
    schema: z.object({
        files: z.array(z.object({
            filePath: z.string().describe("Path to the file to create"),
            content: z.string().describe("Content to write to the file")
        })).describe("an array of file paths and content to create")
    })
});

export const createFileUnderscore = tool(createFileFn, {
    name: "create_file",
    description: createFile.description,
    schema: createFile.schema
});

export const createFilesUnderscore = tool(createFileFn, {
    name: "create_files",
    description: createFile.description,
    schema: createFile.schema
});

export const createFilesHyphen = tool(createFileFn, {
    name: "create-files",
    description: createFile.description,
    schema: createFile.schema
});
