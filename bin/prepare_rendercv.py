"""Adapt the website's CV fields for RenderCV without changing the source YAML."""

import argparse
from copy import deepcopy
from pathlib import Path

import phonenumbers
import yaml


def prepare_cv(data):
    data = deepcopy(data)
    cv = data["cv"]

    if "label" in cv:
        cv.setdefault("headline", cv.pop("label"))
    if "image" in cv:
        image = cv.pop("image")
        if image:
            cv.setdefault("photo", image)

    address = cv.pop("address", {}) or {}
    if not cv.get("location"):
        cv["location"] = ", ".join(
            str(address[key])
            for key in ("street", "city", "region", "postalCode", "countryCode")
            if address.get(key)
        )

    if cv.get("phone"):
        region = address.get("countryCode")
        numbers = cv["phone"] if isinstance(cv["phone"], list) else [cv["phone"]]
        normalized = [
            phonenumbers.format_number(
                phonenumbers.parse(number, region), phonenumbers.PhoneNumberFormat.E164
            )
            for number in numbers
        ]
        cv["phone"] = normalized if isinstance(cv["phone"], list) else normalized[0]

    profiles = []
    for profile in cv.get("social_networks") or []:
        if profile["network"] == "Website":
            username = profile["username"]
            if username.startswith(("https://", "http://")):
                cv.setdefault("website", username)
            elif not cv.get("website"):
                cv.setdefault("custom_connections", []).append(
                    {"placeholder": username, "fontawesome_icon": "globe", "url": None}
                )
        else:
            profiles.append(profile)
    if "social_networks" in cv:
        cv["social_networks"] = profiles

    sections = cv.setdefault("sections", {})
    summary = cv.pop("summary", None)
    if summary:
        cv["sections"] = sections = {"Professional Summary": [summary], **sections}

    for entries in sections.values():
        for entry in entries:
            if not isinstance(entry, dict):
                continue
            if "institution" in entry:
                if "studyType" in entry:
                    entry.setdefault("degree", entry.pop("studyType"))
                score = entry.pop("score", None)
                if score and not any(
                    str(item).startswith("GPA:") for item in entry.get("highlights", [])
                ):
                    entry.setdefault("highlights", []).append(f"GPA: {score}")
            elif "title" in entry and "authors" in entry:
                if "publisher" in entry:
                    entry.setdefault("journal", entry.pop("publisher"))
                if "releaseDate" in entry:
                    entry.setdefault("date", entry.pop("releaseDate"))
            elif "name" in entry and "keywords" in entry:
                entry.setdefault("label", entry.pop("name"))
                entry.setdefault("details", ", ".join(entry.pop("keywords")))
            elif "title" in entry and "awarder" in entry:
                entry.setdefault("name", entry.pop("title"))
                entry.setdefault("summary", entry.pop("awarder"))
            # Integer years stay year-only; string years otherwise render as January.
            date = entry.get("date")
            if isinstance(date, str) and len(date) == 4 and date.isdecimal():
                entry["date"] = int(date)

    return data


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--settings", type=Path)
    args = parser.parse_args()
    # Keep the temporary input beside the source so relative config paths still work.
    if args.source.resolve().parent != args.output.resolve().parent:
        parser.error("The output must be in the same directory as the source CV.")
    data = yaml.safe_load(args.source.read_text(encoding="utf-8"))
    if args.settings:
        # RenderCV discovers design/locale references from the main input file.
        data["settings"] = yaml.safe_load(args.settings.read_text(encoding="utf-8"))["settings"]
    args.output.write_text(
        yaml.safe_dump(prepare_cv(data), sort_keys=False, allow_unicode=True),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
