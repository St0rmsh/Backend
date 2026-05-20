http://localhost/api/sandbox/start

  {
    "message": "Sandbox started successfully",
    "sandboxId": "019e434b-fe73-711f-b294-1e142a6233b9",
    "previewUrl": "http://019e434b-fe73-711f-b294-1e142a6233b9.preview.localhost" // create iframe using this [preview url] 
 }



this API  GET http://019e434b-fe73-711f-b294-1e142a6233b9.agent.localhost/list-files


{
    "message": "Elements in Working dir",
    "files": [
        ".dockerignore",
        ".gitignore",
        "README.md",
        "dockerfile",
        "eslint.config.js",
        "index.html",
        "package-lock.json",
        "package.json",
        "public/favicon.svg",
        "public/icons.svg",
        "src/App.css",
        "src/App.jsx",
        "src/assets/hero.png",
        "src/assets/react.svg",
        "src/assets/vite.svg",
        "src/components/SnakeGame.css",
        "src/components/SnakeGame.jsx",
        "src/index.css",
        "src/main.jsx",
        "vite.config.js"
    ]
}




this API POST  create-file http://019e434b-fe73-711f-b294-1e142a6233b9.agent.localhost/create-file


{
    "files": [
        {
            "filePath":"/src/index.html",
            "content":"Hello from Index "
        },
         {
            "filePath":"/src/style.css",
            "content":"Hello from Css "
        },
         {
            "filePath":"/src/script.js",
            "content":"Hello from JavaScript "
        }

    ]
}



this API  GET read-file?files=/src/App.jsx http://019e434b-fe73-711f-b294-1e142a6233b9.agent.localhost/read-file?files=/src/App.jsx


{
    "message": "File read successfully",
    "data": [
        {
            "/src/App.jsx": "import { useState } from 'react'\nimport SnakeGame from './components/SnakeGame'\nimport './App.css'\n\nfunction App() {\n  const [score, setScore] = useState(0)\n\n  return (\n    <main>\n      <h1>Snake Game</h1>\n      <SnakeGame onScoreChange={setScore} />\n      <ScoreDisplay score={score} />\n    </main>\n  )\n}\n\nfunction ScoreDisplay({ score }) {\n  return (\n    <div className=\"score-display\">\n      <p>Score: <strong>{score}</strong></p>\n    </div>\n  )\n}\n\nexport default App"
        }
    ]
}






this API POST update-file http://019e434b-fe73-711f-b294-1e142a6233b9.agent.localhost/update-file


{
    "updates": [
       {
            "filePath": "src/App.jsx",
            "content": "import { useState } from 'react'\nimport reactLogo from './assets/react.svg'\nimport viteLogo from './assets/vite.svg'\nimport heroImg from './assets/hero.png'\nimport './App.css'\n\nfunction App() {\n  const [count, setCount] = useState(0)\n\n  return (\n    <>\n      <section id=\"center\">\n        <div className=\"hero\">\n          <img src={heroImg} className=\"base\" width=\"170\" height=\"179\" alt=\"\" />\n          <img src={reactLogo} className=\"framework\" alt=\"React logo\" />\n          <img src={viteLogo} className=\"vite\" alt=\"Vite logo\" />\n        </div>\n        <div>\n          <h1>Get </h1>\n          <p>\n            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>\n          </p>\n        </div>\n        <button\n          type=\"button\"\n          className=\"counter\"\n          onClick={() => setCount((count) => count + 1)}\n        >\n          Count is {count}\n        </button>\n      </section>\n\n      <div className=\"ticks\"></div>\n\n      <section id=\"next-steps\">\n        <div id=\"docs\">\n          <svg className=\"icon\" role=\"presentation\" aria-hidden=\"true\">\n            <use href=\"/icons.svg#documentation-icon\"></use>\n          </svg>\n          <h2>Documentation</h2>\n          <p>Your questions, answered</p>\n          <ul>\n            <li>\n              <a href=\"https://vite.dev/\" target=\"_blank\">\n                <img className=\"logo\" src={viteLogo} alt=\"\" />\n                Explore Vite\n              </a>\n            </li>\n            <li>\n              <a href=\"https://react.dev/\" target=\"_blank\">\n                <img className=\"button-icon\" src={reactLogo} alt=\"\" />\n                Learn more\n              </a>\n            </li>\n          </ul>\n        </div>\n        <div id=\"social\">\n          <svg className=\"icon\" role=\"presentation\" aria-hidden=\"true\">\n            <use href=\"/icons.svg#social-icon\"></use>\n          </svg>\n          <h2>Connect with us</h2>\n          <p>Join the Vite community</p>\n          <ul>\n            <li>\n              <a href=\"https://github.com/vitejs/vite\" target=\"_blank\">\n                <svg\n                  className=\"button-icon\"\n                  role=\"presentation\"\n                  aria-hidden=\"true\"\n                >\n                  <use href=\"/icons.svg#github-icon\"></use>\n                </svg>\n                GitHub\n              </a>\n            </li>\n            <li>\n              <a href=\"https://chat.vite.dev/\" target=\"_blank\">\n                <svg\n                  className=\"button-icon\"\n                  role=\"presentation\"\n                  aria-hidden=\"true\"\n                >\n                  <use href=\"/icons.svg#discord-icon\"></use>\n                </svg>\n                Discord\n              </a>\n            </li>\n            <li>\n              <a href=\"https://x.com/vite_js\" target=\"_blank\">\n                <svg\n                  className=\"button-icon\"\n                  role=\"presentation\"\n                  aria-hidden=\"true\"\n                >\n                  <use href=\"/icons.svg#x-icon\"></use>\n                </svg>\n                X.com\n              </a>\n            </li>\n            <li>\n              <a href=\"https://bsky.app/profile/vite.dev\" target=\"_blank\">\n                <svg\n                  className=\"button-icon\"\n                  role=\"presentation\"\n                  aria-hidden=\"true\"\n                >\n                  <use href=\"/icons.svg#bluesky-icon\"></use>\n                </svg>\n                Bluesky\n              </a>\n            </li>\n          </ul>\n        </div>\n      </section>\n\n      <div className=\"ticks\"></div>\n      <section id=\"spacer\"></section>\n    </>\n  )\n}\n\nexport default App\n"
        }

    ]
}




this API POST invoke http://localhost/api/ai/invoke

req.body = {
    "messages":"make a snake game  ",
    "sandboxId": "019e434b-fe73-711f-b294-1e142a6233b9"
}

response will be in SSE
 
 {"type":"done","message":"Agent invoked successfully","result":{"messages":[{"lc":1,"type":"constructor","id":["langchain_core","messages","AIMessageChunk"],"kwargs":{"content":"Snake game built! Play
08:24:34.402
[{"lc":1,"type":"constructor","id":["langchain_core","messages","AIMessageChunk"],"kwargs":{"content":"Snake game built! Playable canvas with score tracking, pause, and game-over states. All controls
08:24:34.295
[{"lc":1,"type":"constructor","id":["langchain_core","messages","ToolMessage"],"kwargs":{"status":"success","content":"","tool_call_id":"036zzChl9","name":"update_files","metadata":{"versions":{"@lang
08:24:32.200
{"type":"progress","message":"Updated Files Successfully...\n"}
08:24:32.152
{"type":"progress","message":"Updating Files in the project directory...\n"}
08:24:30.590
[{"lc":1,"type":"constructor","id":["langchain_core","messages","AIMessageChunk"],"kwargs":{"content":"I'll build a polished, production-quality Snake game using React. Here's the plan:\n\n1. Create a
08:24:30.510
[{"lc":1,"type":"constructor","id":["langchain_core","messages","ToolMessage"],"kwargs":{"status":"success","content":"[{\"/package.json\":\"{\\n \\\"name\\\": \\\"template\\\",\\n \\\"private\\\":
08:24:12.647
{"type":"progress","message":"Reading Files Successfully...\n"}
08:24:12.555
{"type":"progress","message":"Reading Files in the project directory...\n"}
08:24:12.357
[{"lc":1,"type":"constructor","id":["langchain_core","messages","AIMessageChunk"],"kwargs":{"content":"","tool_call_chunks":[{"name":"read_files","args":"{\"files\": [\"package.json\", \"src/App.jsx\"
08:24:12.303

then we have a socket.io url

http://019e434b-fe73-711f-b294-1e142a6233b9.agent.localhost // use xterm js for terminal on frontend input and output  

with input name "terminal-input"  for terminal input and "terminal-output" for terminal output



