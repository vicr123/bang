#!/bin/bash

# Install required modules for group-one-factorial
prepareReact() {
    cd react;
    
    echo "[REACT] Installing npm dependencies for React. This could take a while...";
    npm install > /dev/null 2>&1;
    
    echo "[REACT] Building React site...";
    npm run build > /dev/null 2>&1;
    
    echo "[REACT] React is ready.";
}

prepareExpress() {
    cd express;
    
    echo "[EXPRS] Installing npm dependencies for Express. This could take a while...";
    npm install > /dev/null 2>&1
    
    echo "[EXPRS] Express is ready.";
}

prepareReact &
prepareExpress &

wait
echo "Bootstrap complete"