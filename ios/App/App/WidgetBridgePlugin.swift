import Capacitor
import Foundation
import WidgetKit

@objc(WidgetBridgePlugin)
public class WidgetBridgePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "WidgetBridgePlugin"
    public let jsName = "WidgetBridge"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "setSnapshot", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "clearSnapshot", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "reload", returnType: CAPPluginReturnPromise)
    ]

    @objc func setSnapshot(_ call: CAPPluginCall) {
        guard let value = call.getString("value") else {
            call.reject("Must provide a value")
            return
        }
        guard WidgetSnapshotStore.write(value) else {
            call.reject(Self.appGroupUnavailable)
            return
        }
        call.resolve()
    }

    @objc func clearSnapshot(_ call: CAPPluginCall) {
        guard WidgetSnapshotStore.clear() else {
            call.reject(Self.appGroupUnavailable)
            return
        }
        call.resolve()
    }

    @objc func reload(_ call: CAPPluginCall) {
        WidgetCenter.shared.reloadAllTimelines()
        call.resolve()
    }

    private static let appGroupUnavailable =
        "App group \(WidgetSnapshotStore.appGroup) is unavailable"
}
