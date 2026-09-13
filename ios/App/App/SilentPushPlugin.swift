import Capacitor
import Foundation
import UIKit

enum SilentPushDelivery {
    static let received = Notification.Name("silentPushReceived")

    private static let lock = NSLock()
    private static var pending: [(UIBackgroundFetchResult) -> Void] = []
    private static let budget: TimeInterval = 20

    static func receive(completion: @escaping (UIBackgroundFetchResult) -> Void) {
        lock.lock()
        pending.append(completion)
        lock.unlock()

        NotificationCenter.default.post(name: received, object: nil)
        DispatchQueue.main.asyncAfter(deadline: .now() + budget) {
            finish(.noData)
        }
    }

    static func finish(_ result: UIBackgroundFetchResult) {
        lock.lock()
        let handlers = pending
        pending = []
        lock.unlock()

        for handler in handlers {
            handler(result)
        }
    }
}

@objc(SilentPushPlugin)
public class SilentPushPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "SilentPushPlugin"
    public let jsName = "SilentPush"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "handled", returnType: CAPPluginReturnPromise)
    ]

    override public func load() {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(didReceiveSilentPush),
            name: SilentPushDelivery.received,
            object: nil
        )
    }

    deinit {
        NotificationCenter.default.removeObserver(self)
    }

    @objc private func didReceiveSilentPush() {
        notifyListeners("silentPush", data: [:], retainUntilConsumed: true)
    }

    @objc func handled(_ call: CAPPluginCall) {
        SilentPushDelivery.finish(.newData)
        call.resolve()
    }
}
