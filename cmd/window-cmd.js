var cmd=require('node-cmd');
 
//Windows multiline commands are not guaranteed to work try condensing to a single line.
    
    const syncData=cmd.runSync('cd ./example & dir');
 
    console.log(`
    
        Sync Err ${syncData.err}
        
        Sync stderr:  ${syncDir.stderr}
 
        Sync Data ${syncData.data}
    
    `);
 
    cmd.run(`dir`,
        function(err, data, stderr){
            console.log('the node-cmd dir contains : ',data)
        }
    );

    var spawn = require("child_process").spawn,child;
    child = spawn("powershell.exe",["get-service sshd"]);
    child.stdout.on("data",function(data){
        console.log("Powershell Data: " + data);
    });
    child.stderr.on("data",function(data){
        console.log("Powershell Errors: " + data);
    });
    child.on("exit",function(){
        console.log("Powershell Script finished");
    });
    child.stdin.end(); //end input