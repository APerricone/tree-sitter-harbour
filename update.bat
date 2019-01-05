call .\node_modules\.bin\tree-sitter generate
if %errorLevel%==0 (
    npm install 
)