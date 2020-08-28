/// api_version=2
var script = registerScript({
        name: "RPCToggler",
        version: "1.0",
        authors: ["ponei"]
    });

var LiquidBounce = Java.type("net.ccbluex.liquidbounce.LiquidBounce");
var PipeStatus = Java.type("com.jagrosh.discordipc.entities.pipe.PipeStatus");

script.registerModule({
    name: "RPCToggler",
    description: "Toggle LiquidBounce's Rich Presence",
    category: "Misc"
}, function (module) {
    module.on("enable", function () {
        Chat.print("[1/3] Getting ClientRichPresence instance...");
        getInstance();
        Chat.print("[2/3] Checking if RPC is running...");
        var status = getRPCStatus();

        if (status == PipeStatus.DISCONNECTED) {
            Chat.print("[3/3] RPC is disconnected. Starting RPC...");
            rpc.setup();
        } else if (status == PipeStatus.CONNECTED) {
            Chat.print("[3/3] RPC is connected. Stopping RPC...");
            rpc.shutdown();
        } else {
            Chat.print("[3/3] RPC is in an awkward state. (?)");
        }
    });

    var rpc;
    function getInstance() {
        var clientInstance = LiquidBounce.INSTANCE.getClass();
        var rpcField = clientInstance.getDeclaredField("clientRichPresence");
        rpcField.setAccessible(true);
        rpc = rpcField.get(clientInstance);
    }

    function getRPCStatus() {
        var rpcClient = rpc.getClass().getDeclaredField("ipcClient");
        rpcClient.setAccessible(true);
        var client = rpcClient.get(rpc);
        return client.getStatus();
    }

});
