import Foundation

struct ScheduledItemSnapshotEntry: Decodable, Identifiable {
    let key: String
    let itemId: String
    let title: String
    let occurrence: Date

    var id: String { key }
}

struct ScheduledItemSnapshot: Decodable {
    let version: Int
    let generatedAt: Date
    let entries: [ScheduledItemSnapshotEntry]
}

enum WidgetSnapshotStore {
    static let appGroup = "group.love.collab.app"
    static let key = "scheduled-item-snapshot"

    static func write(_ value: String) -> Bool {
        guard let defaults = UserDefaults(suiteName: appGroup) else {
            return false
        }
        defaults.set(value, forKey: key)
        return true
    }

    static func read() -> ScheduledItemSnapshot? {
        guard let defaults = UserDefaults(suiteName: appGroup),
              let data = defaults.string(forKey: key)?.data(using: .utf8)
        else {
            return nil
        }
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .millisecondsSince1970
        return try? decoder.decode(ScheduledItemSnapshot.self, from: data)
    }
}
