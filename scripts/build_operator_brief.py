#!/usr/bin/env python3
"""Build Leon Basin's five-page public operator brief."""

from pathlib import Path

from reportlab.lib.colors import Color, HexColor
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas


OUT = Path(__file__).resolve().parents[1] / "assets" / "downloads" / "leon-basin-broken-gtm-motion.pdf"
W, H = letter
PAPER = HexColor("#F7F3EB")
INK = HexColor("#11100E")
MUTED = HexColor("#5F5A52")
GOLD = HexColor("#A77820")
RULE = Color(17 / 255, 16 / 255, 14 / 255, alpha=0.32)
MARGIN = 44


def set_fill(c, color):
    c.setFillColor(color)


def page(c, number, title=None):
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setStrokeColor(RULE)
    c.setLineWidth(0.7)
    c.line(MARGIN, H - 44, W - MARGIN, H - 44)
    c.setFillColor(INK)
    c.setFont("Courier-Bold", 7.5)
    c.drawString(MARGIN, H - 32, "LEON BASIN")
    c.setFillColor(MUTED)
    c.drawCentredString(W / 2, H - 32, "OPERATOR BRIEF NO. 01  |  2026")
    c.setFillColor(GOLD)
    c.setFont("Times-Roman", 12)
    c.drawRightString(W - MARGIN, H - 32, f"{number:02d}")
    if title:
        c.setTitle(title)


def wrapped(c, text, x, y, max_width, font="Helvetica", size=10, leading=14, color=INK):
    words = text.split()
    lines, current = [], ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if current and stringWidth(candidate, font, size) > max_width:
            lines.append(current)
            current = word
        else:
            current = candidate
    if current:
        lines.append(current)
    c.setFillColor(color)
    c.setFont(font, size)
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


def heading(c, text, y, size=38, max_width=480):
    y = wrapped(c, text, MARGIN, y, max_width, "Times-Roman", size, size * 0.93, INK)
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.5)
    c.line(MARGIN, y - 5, MARGIN + 38, y - 5)
    return y - 30


def footer(c):
    c.setStrokeColor(RULE)
    c.setLineWidth(0.7)
    c.line(MARGIN, 34, W - MARGIN, 34)


def cover(c):
    page(c, 1, "How I Diagnose a Broken GTM Motion")
    y = H - 128
    for line in ("How I Diagnose", "a Broken", "GTM Motion."):
        c.setFillColor(INK)
        c.setFont("Times-Roman", 47)
        c.drawString(MARGIN, y, line)
        y -= 51
    c.setFillColor(GOLD)
    c.circle(MARGIN + stringWidth("GTM Motion", "Times-Roman", 47) + 6, y + 45, 3.8, fill=1, stroke=0)
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.5)
    c.line(MARGIN, y + 19, MARGIN + 42, y + 19)
    y -= 26
    c.setFillColor(GOLD)
    c.setFont("Courier-Bold", 10)
    for line in ("FIVE FAILURE PATTERNS.", "ONE DIAGNOSTIC.", "THE LEVERS THAT MOVE REVENUE."):
        c.drawString(MARGIN, y, line)
        y -= 19
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 9)
    c.drawString(MARGIN, 62, "A public-safe field note from more than a decade of building commercial systems.")
    footer(c)
    c.showPage()


def diagnostic(c):
    page(c, 2)
    y = heading(c, "The diagnostic", H - 104, 40)
    y = wrapped(c, "Most pipeline problems are interpretation and ownership problems wearing an activity costume.", MARGIN, y, 500, "Courier-Bold", 10, 16, GOLD) - 28
    stages = [
        ("Capture", "Collect the market movement, account context, and relationship signal that may matter."),
        ("Interpret", "Separate symptoms from the constraint. Decide what is urgent, credible, and worth acting on."),
        ("Package", "Frame the point of view, proof, and recommendation in the buyer's language."),
        ("Route", "Name the owner, the next action, and the date. Interest without ownership decays."),
        ("Learn", "Return replies, objections, wins, and losses to the system so future judgment improves."),
    ]
    gap = 9
    box_w = (W - 2 * MARGIN - 4 * gap) / 5
    line_y = y - 19
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.8)
    c.line(MARGIN + 12, line_y, W - MARGIN - 12, line_y)
    for i, (name, desc) in enumerate(stages, 1):
        x = MARGIN + (i - 1) * (box_w + gap)
        c.setFillColor(PAPER)
        c.setStrokeColor(GOLD)
        c.rect(x, y - 31, 25, 25, fill=1, stroke=1)
        c.setFillColor(GOLD)
        c.setFont("Times-Roman", 14)
        c.drawCentredString(x + 12.5, y - 23, str(i))
        c.setFillColor(INK)
        c.setFont("Courier-Bold", 8)
        c.drawString(x, y - 63, name.upper())
        c.setStrokeColor(GOLD)
        c.line(x, y - 72, x + 20, y - 72)
        wrapped(c, desc, x, y - 94, box_w - 3, "Helvetica", 7.4, 11.2, INK)
    c.setFillColor(MUTED)
    c.setFont("Times-Italic", 12)
    c.drawString(MARGIN, 96, "A dashboard can report the symptom. The diagnostic has to name the break.")
    footer(c)
    c.showPage()


def patterns(c):
    page(c, 3)
    y = heading(c, "Five failure patterns", H - 104, 40)
    patterns_data = [
        ("Signal without interpretation", "Noise enters the system. Few signals are translated into a problem worth solving now."),
        ("Activity without qualification", "Conversations happen, but intent, authority, need, and timing are never established."),
        ("Proof trapped in the wrong language", "The value is real, but it is communicated in terms the buyer does not use or accept."),
        ("Ownership without a next date", "The right person agrees, then the motion stalls without a named action on the calendar."),
        ("Learning that never returns to the system", "Wins and losses are discussed, but the insight does not change future behavior."),
    ]
    for i, (name, desc) in enumerate(patterns_data, 1):
        top = y
        c.setStrokeColor(RULE)
        c.line(MARGIN, top, W - MARGIN, top)
        c.setFillColor(GOLD)
        c.setFont("Times-Roman", 24)
        c.drawString(MARGIN + 8, top - 34, f"{i:02d}")
        c.setStrokeColor(GOLD)
        c.line(MARGIN + 52, top, MARGIN + 52, top - 70)
        c.setFillColor(INK)
        c.setFont("Courier-Bold", 8.5)
        c.drawString(MARGIN + 68, top - 22, name.upper())
        wrapped(c, desc, MARGIN + 68, top - 40, 420, "Helvetica", 8.3, 12, INK)
        y -= 79
    c.setStrokeColor(RULE)
    c.line(MARGIN, y + 5, W - MARGIN, y + 5)
    footer(c)
    c.showPage()


def records(c):
    page(c, 4)
    y = heading(c, "Two operating records", H - 104, 40)
    records_data = [
        ("Fudo Security", "U.S. market entry and GTM systems", [("$424K", "annual operating savings"), ("160%", "U.S. pipeline growth"), ("90 to 5", "day SDR ramp")]),
        ("Sense", "Global business development", [("$10M+", "pipeline built"), ("125%", "response-rate lift"), ("12%", "churn reduction")]),
    ]
    for company, role, metrics in records_data:
        c.setStrokeColor(RULE)
        c.line(MARGIN, y, W - MARGIN, y)
        c.setFillColor(INK)
        c.setFont("Times-Roman", 24)
        c.drawString(MARGIN, y - 35, company)
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 8.3)
        c.drawString(MARGIN, y - 54, role)
        left = MARGIN + 150
        metric_w = (W - MARGIN - left) / 3
        for idx, (value, label) in enumerate(metrics):
            x = left + idx * metric_w
            c.setStrokeColor(RULE)
            c.line(x, y - 12, x, y - 112)
            c.setFillColor(GOLD)
            c.setFont("Times-Roman", 25)
            c.drawString(x + 18, y - 43, value)
            wrapped(c, label.upper(), x + 18, y - 66, metric_w - 25, "Courier-Bold", 7, 10, INK)
        y -= 150
    c.setFillColor(MUTED)
    c.setFont("Times-Italic", 12)
    c.drawString(MARGIN, 116, "Context around a metric is more valuable than the metric alone.")
    c.setFont("Helvetica", 8.5)
    wrapped(c, "The same discipline appears in both records: preserve signal, make ownership explicit, and build feedback into the motion.", MARGIN, 92, 500, "Helvetica", 8.5, 13, MUTED)
    footer(c)
    c.showPage()


def conversation(c):
    page(c, 5)
    y = heading(c, "The first conversation", H - 104, 40)
    prompts = [
        ("What motion is broken?", "Name the stage, the symptom, and what is not working."),
        ("What should be true in 90 days?", "Define the outcome, the leading indicators, and who must be better off."),
        ("Who owns the next action?", "Name the owner, the action, and the next date."),
    ]
    for i, (question, note) in enumerate(prompts, 1):
        c.setStrokeColor(RULE)
        c.line(MARGIN, y, W - MARGIN, y)
        c.setFillColor(GOLD)
        c.setFont("Times-Roman", 24)
        c.drawString(MARGIN + 8, y - 35, f"{i:02d}")
        c.setStrokeColor(GOLD)
        c.line(MARGIN + 52, y, MARGIN + 52, y - 68)
        c.setFillColor(INK)
        c.setFont("Courier-Bold", 9)
        c.drawString(MARGIN + 70, y - 24, question.upper())
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 9)
        c.drawString(MARGIN + 70, y - 46, note)
        y -= 80
    c.setStrokeColor(RULE)
    c.line(MARGIN, y + 8, W - MARGIN, y + 8)
    c.setFillColor(GOLD)
    c.setFont("Courier-Bold", 11)
    y = wrapped(c, "SEND THE COMPANY, THE BROKEN MOTION, AND WHAT SUCCESS MUST CHANGE.", MARGIN, y - 24, 500, "Courier-Bold", 11, 17, GOLD) - 24
    c.setFillColor(INK)
    c.setFont("Times-Roman", 17)
    c.drawString(MARGIN, y, "lbasin23@gmail.com")
    c.drawRightString(W - MARGIN, y, "basinleon.github.io")
    c.linkURL("mailto:lbasin23@gmail.com?subject=GTM%20diagnostic", (MARGIN, y - 5, MARGIN + 170, y + 18), relative=0)
    c.linkURL("https://basinleon.github.io/work-with-me/", (W - MARGIN - 160, y - 5, W - MARGIN, y + 18), relative=0)
    footer(c)
    c.showPage()


def build():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUT), pagesize=letter, pageCompression=1)
    c.setAuthor("Leon Basin")
    c.setSubject("A diagnostic field note for broken GTM motions")
    c.setKeywords("GTM, revenue architecture, pipeline, signal intelligence, Leon Basin")
    cover(c)
    diagnostic(c)
    patterns(c)
    records(c)
    conversation(c)
    c.save()
    print(OUT)


if __name__ == "__main__":
    build()
