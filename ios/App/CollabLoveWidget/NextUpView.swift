import SwiftUI
import WidgetKit

private let visibleRows = 3

struct NextUpView: View {
    let entry: NextUpEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 1) {
            content
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }

    @ViewBuilder
    private var content: some View {
        if let snapshot = entry.snapshot {
            if snapshot.entries.isEmpty {
                NextUpMessage(headline: "Nothing scheduled", detail: "for the next two weeks")
            } else {
                ForEach(snapshot.entries.prefix(visibleRows)) { row in
                    NextUpRow(entry: row, now: entry.date)
                }
                if snapshot.entries.count > visibleRows {
                    NextUpOverflow(count: snapshot.entries.count - visibleRows)
                }
            }
        } else {
            NextUpMessage(headline: "Open collab-love", detail: "to see what's next")
        }
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

private struct NextUpOverflow: View {
    let count: Int

    var body: some View {
        Text("+\(count) more")
            .font(.caption2)
            .lineLimit(1)
            .foregroundStyle(.secondary)
    }
}

private struct NextUpMessage: View {
    let headline: String
    let detail: String

    var body: some View {
        VStack(alignment: .leading, spacing: 1) {
            Text(headline)
                .font(.caption)
                .lineLimit(1)
            Text(detail)
                .font(.caption2)
                .lineLimit(1)
                .foregroundStyle(.secondary)
        }
    }
}
