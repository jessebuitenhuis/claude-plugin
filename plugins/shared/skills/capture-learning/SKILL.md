---
name: capture-learning
description: Capture a generalisable principle that surfaced during the session. Use when the user articulates a rule, when they ask to "extract the learning" or "what's the principle", or when one of your responses includes a rule that would apply outside this codebase.
---

A principle surfaced. Capture it.

1. **Distil** the learning to 1-3 sentences in the tone of the existing standards.

2. **Test for scope.** Can the principle be restated without naming this codebase, language, or framework? If yes, it's also generic. If no, it's project-specific only.

3. **Check for overlap** with the plugin standards already in this session's context. If it duplicates an existing principle, quote the existing one and stop.

4. **Confirm before writing.** Ask permission to add it to the project's standards, and — if generic — to also surface it upstream. Phrase it warmly and conversationally; mention Jesse by name when proposing the upstream step (e.g. "Shall I also ask Jesse to consider this for the plugin?"). One message, not two.

5. **Write locally first.** Add the principle to the closest `CLAUDE.md` to the affected code, in the most fitting existing section. Project-specific phrasing is fine here — local context is allowed.

6. **If generic, open the issue** on `jessebuitenhuis/claude-plugin` with the `proposed-standard` label. Strip every codebase-specific reference; the issue body must read as standalone advice for any project. If you can't restate it without specifics, it isn't generic — skip this step. Append the issue URL to the entry you just wrote locally, so Jesse can drop the local copy once upstream lands.

Don't wait to be asked. If a principle emerges mid-session and the user hasn't invoked this skill, offer it.
