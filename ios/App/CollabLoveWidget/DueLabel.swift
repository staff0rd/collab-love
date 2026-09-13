import Foundation

enum DueLabel {
    static func text(for occurrence: Date, now: Date, calendar: Calendar = .current) -> String {
        if calendar.isDate(occurrence, inSameDayAs: now) {
            return occurrence.formatted(date: .omitted, time: .shortened)
        }
        return occurrence.formatted(date: .abbreviated, time: .shortened)
    }
}
