import WidgetKit

struct NextUpEntry: TimelineEntry {
    let date: Date
    let snapshot: ScheduledItemSnapshot?
}

struct NextUpProvider: TimelineProvider {
    func placeholder(in context: Context) -> NextUpEntry {
        NextUpEntry(date: Date(), snapshot: nil)
    }

    func getSnapshot(in context: Context, completion: @escaping (NextUpEntry) -> Void) {
        completion(currentEntry())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<NextUpEntry>) -> Void) {
        completion(Timeline(entries: [currentEntry()], policy: .atEnd))
    }

    private func currentEntry() -> NextUpEntry {
        NextUpEntry(date: Date(), snapshot: WidgetSnapshotStore.read())
    }
}
