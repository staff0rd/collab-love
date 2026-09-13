import Foundation

enum DeepLink {
    private static let scheme = "collab-love"

    static let home = URL(string: "\(scheme)://home")!

    static func item(_ id: String) -> URL {
        URL(string: "\(scheme)://items/\(id)") ?? home
    }
}
