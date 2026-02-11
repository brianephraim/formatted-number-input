#!/usr/bin/env swift
// sim-ax-tree.swift — Dump the iOS Simulator accessibility tree
//
// Usage:
//   swift scripts/sim-ax-tree.swift              # dump full tree (depth 8)
//   swift scripts/sim-ax-tree.swift 4            # dump tree to depth 4
//   swift scripts/sim-ax-tree.swift 12           # dump tree to depth 12
//
// Prerequisites:
//   - Xcode command line tools installed
//   - The calling process must have macOS Accessibility permission
//     (System Settings > Privacy & Security > Accessibility)
//   - An iOS Simulator must be booted

import ApplicationServices
import Foundation

// MARK: - AX helpers

func axValue(_ element: AXUIElement, _ attr: String) -> AnyObject? {
    var value: AnyObject?
    AXUIElementCopyAttributeValue(element, attr as CFString, &value)
    return value
}

func axChildren(_ element: AXUIElement) -> [AXUIElement] {
    guard let children = axValue(element, kAXChildrenAttribute) as? [AXUIElement] else { return [] }
    return children
}

func dumpTree(_ element: AXUIElement, depth: Int = 0, maxDepth: Int = 8) {
    if depth > maxDepth { return }
    let indent = String(repeating: "  ", count: depth)
    let role = axValue(element, kAXRoleAttribute) as? String ?? "?"
    let title = axValue(element, kAXTitleAttribute) as? String
    let value = axValue(element, kAXValueAttribute) as? String
    let label = axValue(element, kAXDescriptionAttribute) as? String

    var line = "\(indent)[\(role)]"
    if let t = title, !t.isEmpty { line += " title=\"\(t)\"" }
    if let v = value, !v.isEmpty { line += " value=\"\(v)\"" }
    if let l = label, !l.isEmpty { line += " desc=\"\(l)\"" }
    print(line)

    for child in axChildren(element) {
        dumpTree(child, depth: depth + 1, maxDepth: maxDepth)
    }
}

// MARK: - Main

let maxDepth = CommandLine.arguments.count > 1
    ? Int(CommandLine.arguments[1]) ?? 8
    : 8

guard AXIsProcessTrusted() else {
    fputs("""
    ERROR: This process is not trusted for Accessibility access.

    Fix: System Settings > Privacy & Security > Accessibility
    Add the application that is running this script (e.g. Terminal, Claude, VS Code).

    """, stderr)
    exit(1)
}

// Find Simulator PID
let task = Process()
task.executableURL = URL(fileURLWithPath: "/usr/bin/pgrep")
task.arguments = ["-x", "Simulator"]
let pipe = Pipe()
task.standardOutput = pipe
try task.run()
task.waitUntilExit()

let pidStr = String(data: pipe.fileHandleForReading.readDataToEndOfFile(), encoding: .utf8)!
    .trimmingCharacters(in: .whitespacesAndNewlines)

guard let pid = Int32(pidStr.split(separator: "\n").first ?? "") else {
    fputs("ERROR: No booted iOS Simulator found. Launch one first.\n", stderr)
    exit(1)
}

print("Simulator PID: \(pid)")
print("---")

let app = AXUIElementCreateApplication(pid)
dumpTree(app, maxDepth: maxDepth)
