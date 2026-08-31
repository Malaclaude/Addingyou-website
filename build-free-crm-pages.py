#!/usr/bin/env python3
"""
Generate the free-CRM landing pages, one per vertical, from a single template.

    python3 build-free-crm-pages.py

Why a generator rather than hand-copied pages: the offer needs a page per
vertical, because "free CRM for venues that sell bookable time" is a phrase
nobody recognises as themselves. An indoor golf owner does not think "I sell
bookable time", he thinks "I run a golf sim place". The page has to say the
words he uses. But five hand-maintained copies drift within a month, and a
correction made to one silently does not reach the others.

So: one template, one config block per vertical, pages regenerated on demand.

THE SAFETY CHECK: this script must reproduce the existing padel page byte for
byte. `verify.sh` (or the --check flag) diffs the regenerated padel page against
the committed one. If they differ, the template is wrong, not the page.

Adding a vertical is a new entry in VERTICALS plus a hero image. Everything
else follows.
"""

from __future__ import annotations

import pathlib
import sys

HERE = pathlib.Path(__file__).parent
TEMPLATE = HERE / "_free-crm-template.html"


def platform_options(pairs: list[tuple[str, str]]) -> str:
    """
    Render the booking-platform <option> list.

    Getting these wrong is not cosmetic. A padel owner shown "Trackman" as an
    option concludes we do not know the industry, which is the exact opposite of
    what a vertical-specific page is for. The last three are common to every
    vertical and are appended automatically.
    """
    indent = " " * 20
    lines = [f'{indent}<option value="{v}">{label}</option>' for v, label in pairs]
    lines += [
        f'{indent}<option value="other_platform">Other</option>',
        f'{indent}<option value="phone_whatsapp">Phone / WhatsApp</option>',
        # not_open_yet is load-bearing: rules.py flags these as `pre-opening`,
        # which is the highest-value prospect type in the whole funnel. A club
        # mid-fit-out has committed serious capital and has no systems at all.
        f'{indent}<option value="not_open_yet">Not open yet</option>',
    ]
    return "\n".join(lines).lstrip()


def capacity_options(pairs: list[tuple[str, str]]) -> str:
    indent = " " * 20
    return "\n".join(
        f'{indent}<option value="{v}">{label}</option>' for v, label in pairs
    ).lstrip()


# The buckets are deliberately the same raw values across verticals ("1-2",
# "3-5", "6-11", "12+") even though the label changes from courts to bays. The
# rules engine compares against those raw values, so keeping them identical
# means a new vertical needs no backend change at all. Only the label moves.
STANDARD_CAPACITY = [
    ("1-2", "1 to 2"),
    ("3-5", "3 to 5"),
    ("6-11", "6 to 11"),
    ("12+", "12 or more"),
]


VERTICALS = {
    "padel": {
        "slug": "free-crm-padel",
        "vertical": "padel",
        "title_noun": "Padel Clubs",
        "meta_desc": (
            "A free CRM system for UK padel clubs already taking bookings. Every player "
            "in one place, automatic rebooking chase, membership tracking. No setup fee, "
            "no card."
        ),
        "og_desc": (
            "Your booking system takes the booking. It does not chase the rebook. We give "
            "padel clubs the CRM layer that does, free."
        ),
        "hero_img": (
            "https://images.pexels.com/photos/35261961/pexels-photo-35261961.jpeg"
            "?auto=compress&cs=tinysrgb"
        ),
        "nav_note": "UK based · Built for padel",
        "eyebrow": "Free for UK padel clubs",
        "hero_sub": (
            "Playtomic and Playskan are great at filling a slot. Neither one tells you who\n"
            "          hasn't played in three weeks, which member is about to lapse, or which\n"
            "          pay-as-you-go player should have been sold a membership by now.\n"
            "          We give padel clubs that layer. Free."
        ),
        "platforms": platform_options([
            ("playtomic", "Playtomic"),
            ("playskan", "Playskan"),
            ("matchi", "MATCHi"),
            ("courtbrain", "Courtbrain"),
        ]),
        "capacity_label": "Number of courts",
        "capacity_options": capacity_options(STANDARD_CAPACITY),
        "placeholder": (
            "e.g. We've no idea who's stopped coming. People play for a month, drop off, "
            "and we only notice when the courts look quiet."
        ),
        "get_01": (
            "Court bookings, coaching, memberships and enquiries against one record per "
            "person, instead of spread across a booking app, a WhatsApp group and someone's "
            "inbox."
        ),
        "get_02": (
            "A player who hasn't been back in three weeks gets a nudge without anyone "
            "remembering to send it. An empty peak-time court is the most expensive thing "
            "in the building."
        ),
        "stat_line": (
            "Northampton based, working with sport and leisure venues across the UK. "
            "We know padel because we're in these buildings."
        ),
        "fair_use": (
            "The account is for running your club. It comes with generous limits on "
            "contacts and monthly sends that no normal padel club will reach. Email and "
            "SMS sending sits on your own account at cost price, so heavy senders pay "
            "their own way. Accounts left completely unused for 90 days get archived, and "
            "we'll email you first."
        ),
        "faq_replace_q": "Does this replace Playtomic or Playskan?",
    },
    "indoor-golf": {
        "slug": "free-crm-indoor-golf",
        "vertical": "indoor-golf",
        "title_noun": "Indoor Golf Venues",
        "meta_desc": (
            "A free CRM system for UK indoor golf venues already taking bookings. Every "
            "player in one place, automatic rebooking chase, membership tracking. No setup "
            "fee, no card."
        ),
        "og_desc": (
            "Your booking system takes the booking. It does not chase the rebook. We give "
            "indoor golf venues the CRM layer that does, free."
        ),
        "hero_img": (
            "https://images.pexels.com/photos/31212256/pexels-photo-31212256/"
            "free-photo-of-indoor-golf-simulator-room-in-mississauga.jpeg"
            "?auto=compress&cs=tinysrgb"
        ),
        "nav_note": "UK based · Built for indoor golf",
        "eyebrow": "Free for UK indoor golf venues",
        # Deliberately names the actual pain of a sim venue rather than reusing the
        # padel copy. A bay sitting empty at 7pm on a Tuesday is the number every
        # owner of one of these already has in his head.
        "hero_sub": (
            "Trackman and Uneekor are great at filling a bay. Neither one tells you who\n"
            "          hasn't been in for three weeks, which member is about to lapse, or which\n"
            "          pay-as-you-go golfer should have been sold a membership by now.\n"
            "          We give indoor golf venues that layer. Free."
        ),
        "platforms": platform_options([
            ("trackman", "Trackman"),
            ("uneekor", "Uneekor"),
            ("golfmanager", "GolfManager"),
            ("yourgolfbooking", "YourGolfBooking"),
            ("simbookings", "Sim/booking widget on our site"),
        ]),
        "capacity_label": "Number of bays",
        "capacity_options": capacity_options(STANDARD_CAPACITY),
        "placeholder": (
            "e.g. We've no idea who's stopped coming. People book a few sessions, drift "
            "off, and we only notice when the bays look quiet midweek."
        ),
        "get_01": (
            "Bay bookings, coaching, memberships and enquiries against one record per "
            "person, instead of spread across a booking widget, a WhatsApp group and "
            "someone's inbox."
        ),
        "get_02": (
            "A golfer who hasn't been back in three weeks gets a nudge without anyone "
            "remembering to send it. An empty bay at 7pm on a Tuesday is the most "
            "expensive thing in the building."
        ),
        # The one line on the page that a competitor cannot copy: a real client,
        # in this exact vertical, with numbers.
        "stat_line": (
            "Northampton based. We run the growth systems for an indoor golf venue in "
            "Milton Keynes, so we know these buildings from the inside."
        ),
        "fair_use": (
            "The account is for running your venue. It comes with generous limits on "
            "contacts and monthly sends that no normal indoor golf venue will reach. "
            "Email and SMS sending sits on your own account at cost price, so heavy "
            "senders pay their own way. Accounts left completely unused for 90 days get "
            "archived, and we'll email you first."
        ),
        "faq_replace_q": "Does this replace Trackman or my booking widget?",
    },
}


def render(cfg: dict, template: str) -> str:
    out = template
    for key, value in cfg.items():
        token = "{{" + key.upper() + "}}"
        if token not in out:
            raise SystemExit(f"token {token} not found in template")
        out = out.replace(token, value)
    leftover = [
        line for line in out.splitlines()
        if "{{" in line and "}}" in line
    ]
    if leftover:
        raise SystemExit(f"unreplaced tokens remain: {leftover[:3]}")
    return out


def main() -> None:
    check_only = "--check" in sys.argv
    template = TEMPLATE.read_text()

    for name, cfg in VERTICALS.items():
        page = render(cfg, template)
        target = HERE / cfg["slug"] / "index.html"

        if check_only:
            if not target.exists():
                print(f"MISSING  {target}")
                continue
            same = target.read_text() == page
            print(f"{'ok      ' if same else 'DIFFERS '} {target}")
            if not same:
                sys.exit(1)
            continue

        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(page)
        print(f"wrote {target}  ({len(page):,} bytes)")


if __name__ == "__main__":
    main()
