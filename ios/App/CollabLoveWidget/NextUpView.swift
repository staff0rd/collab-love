import SwiftUI
import WidgetKit

private let visibleRows = 3

struct NextUpView: View {
    let entry: NextUpEntry

    private var rows: [ScheduledItemSnapshotEntry] {
        Array((entry.snapshot?.entries ?? []).prefix(visibleRows))
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 1) {
            if rows.isEmpty {
                Text("Nothing scheduled")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            } else {
                ForEach(rows) { row in
                    NextUpRow(entry: row, now: entry.date)
                }
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }
}

private struct NextUpRow: View {
    let entry: ScheduledItemSnapshotEntry
    let now: Date

    var body: some View {
        HStack(alignment: .firstTextBaseline, spacing: 4) {
            Text(entry.title)
                .lineLimit(1)
                .truncationMode(.tail)
            Spacer(minLength: 4)
            Text(DueLabel.text(for: entry.occurrence, now: now))
                .lineLimit(1)
                .foregroundStyle(.secondary)
        }
        .font(.caption2)
    }
}
