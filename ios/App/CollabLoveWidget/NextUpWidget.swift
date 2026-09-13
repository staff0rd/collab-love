import SwiftUI
import WidgetKit

struct NextUpWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "NextUpWidget", provider: NextUpProvider()) { entry in
            NextUpView(entry: entry)
                .containerBackground(.clear, for: .widget)
        }
        .configurationDisplayName("Next up")
        .description("The next three scheduled items.")
        .supportedFamilies([.accessoryRectangular])
    }
}
