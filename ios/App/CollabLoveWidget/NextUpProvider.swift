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
        let entry = currentEntry()
        completion(Timeline(entries: [entry], policy: .after(nextMidnight(after: entry.date))))
    }

    private func nextMidnight(after date: Date) -> Date {
        let calendar = Calendar.current
        let tomorrow = calendar.date(byAdding: .day, value: 1, to: date) ?? date
        return calendar.startOfDay(for: tomorrow)
    }

    private func currentEntry() -> NextUpEntry {
        NextUpEntry(date: Date(), snapshot: WidgetSnapshotStore.read())
    }
}
