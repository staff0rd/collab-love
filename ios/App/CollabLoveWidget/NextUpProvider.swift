import WidgetKit

private let snapshotHorizonDays = 14

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
        let midnights = midnights(after: entry.date, days: snapshotHorizonDays)
        // Each entry re-labels the same snapshot against its own date, so a run of midnight
        // entries rolls the day labels over even when the reload request is budgeted away.
        let entries = [entry] + midnights.map { NextUpEntry(date: $0, snapshot: entry.snapshot) }
        completion(Timeline(entries: entries, policy: midnights.first.map { .after($0) } ?? .atEnd))
    }

    private func midnights(after date: Date, days: Int) -> [Date] {
        let calendar = Calendar.current
        return (1...days).compactMap { day in
            calendar.date(byAdding: .day, value: day, to: date).map(calendar.startOfDay)
        }
    }

    private func currentEntry() -> NextUpEntry {
        NextUpEntry(date: Date(), snapshot: WidgetSnapshotStore.read())
    }
}
