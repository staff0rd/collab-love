import Foundation

private let daysInWeek = 7

enum DueLabel {
    static func text(for occurrence: Date, now: Date, calendar: Calendar = .current) -> String {
        let days = calendar.dateComponents(
            [.day],
            from: calendar.startOfDay(for: now),
            to: calendar.startOfDay(for: occurrence)
        ).day ?? 0

        if days < 0 {
            return "\(-days)d late"
        }
        if days == 0 {
            return time(occurrence, calendar: calendar)
        }
        if days < daysInWeek {
            return occurrence.formatted(.dateTime.weekday(.abbreviated))
        }
        return dayOfMonth(occurrence, calendar: calendar)
    }

    // The month is dropped because the snapshot only reaches 14 days out, so no day number
    // can repeat within the window an entry can sit in. Widen the horizon and this lies.
    private static func dayOfMonth(_ occurrence: Date, calendar: Calendar) -> String {
        let day = calendar.component(.day, from: occurrence)
        return ordinal.string(from: NSNumber(value: day)) ?? "\(day)"
    }

    private static let ordinal: NumberFormatter = {
        let formatter = NumberFormatter()
        formatter.numberStyle = .ordinal
        return formatter
    }()

    private static func time(_ occurrence: Date, calendar: Calendar) -> String {
        let hour = Date.FormatStyle.dateTime.hour(.defaultDigits(amPM: .abbreviated))
        let onTheHour = calendar.component(.minute, from: occurrence) == 0
        let formatted = occurrence.formatted(onTheHour ? hour : hour.minute())
        // Locales separate the am/pm marker with a space (U+202F on iOS), which costs a
        // character the 161pt lock screen row cannot spare. 24-hour locales are unaffected.
        return formatted.filter { !$0.isWhitespace }
    }
}
