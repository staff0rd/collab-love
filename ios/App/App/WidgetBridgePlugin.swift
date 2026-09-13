import Capacitor
import Foundation

@objc(WidgetBridgePlugin)
public class WidgetBridgePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "WidgetBridgePlugin"
    public let jsName = "WidgetBridge"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "setSnapshot", returnType: CAPPluginReturnPromise)
    ]

    @objc func setSnapshot(_ call: CAPPluginCall) {
        guard let value = call.getString("value") else {
            call.reject("Must provide a value")
            return
        }
        guard WidgetSnapshotStore.write(value) else {
            call.reject("App group \(WidgetSnapshotStore.appGroup) is unavailable")
            return
        }
        call.resolve()
    }
}
