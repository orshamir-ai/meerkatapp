#!/usr/bin/env bash
#
# Move the support address off Gmail and onto the custom domain.
#
#   ./tools/update-support-email.sh              # dry run — shows what WOULD change
#   ./tools/update-support-email.sh --apply      # makes the change, then verifies
#
# WHY A SCRIPT AND NOT A ONE-LINE sed. The address is written into SEVEN files
# as real markup — deliberately, because a contact route that needs JavaScript
# to appear is no use in a legal document (see assets/js/config.js, which says
# so). The failure mode of that choice is a partial replace: some pages moved,
# one left on the old address, and the stale one is in a document a regulator
# may read. This refuses to leave that state — it verifies afterwards and fails
# loudly if anything is left behind.
#
# RUN IT ONLY ONCE THE NEW MAILBOX ACTUALLY RECEIVES MAIL. An address in a
# privacy policy that bounces is worse than a Gmail one that works: the whole
# point of the address is that a parent can reach a human. Send yourself a test
# message first.
set -euo pipefail

OLD='meerkatuniverse.support@gmail.com'

# ONE ADDRESS, NOT TWO (owner decision). A dedicated `privacy@` was considered
# and dropped: one address that definitely works beats two that might not, and a
# second one is a second mailbox to keep alive, a second thing to verify, and a
# second way to end up half-migrated — with a legal page pointing somewhere
# nobody reads. Hard-coded rather than left as an override for the same reason:
# an option nobody wants is an invitation to the split this decision refuses.
NEW='support@meerkatuniverse.com'

cd "$(dirname "$0")/.."

APPLY=0
[[ "${1:-}" == "--apply" ]] && APPLY=1

FILES=$(grep -rl "$OLD" . --include='*.html' --include='*.md' 2>/dev/null | grep -v '/\.git/' || true)

if [[ -z "$FILES" ]]; then
  echo "Nothing to do — '$OLD' does not appear anywhere."
  exit 0
fi

echo "Replacing:  $OLD"
echo "With:       $NEW"
echo
echo "Files:"
for f in $FILES; do
  printf '  %2d × %s\n' "$(grep -c "$OLD" "$f")" "$f"
done
echo

if [[ $APPLY -eq 0 ]]; then
  echo "DRY RUN — nothing changed. Re-run with --apply to make the change."
  exit 0
fi

for f in $FILES; do
  # Both halves of a mailto link carry the address — the href AND the visible
  # text — so a plain global replace is correct here and a href-only one would
  # leave the old address on screen while the link went somewhere else, which
  # is the worst of the possible outcomes.
  sed -i '' "s|$OLD|$NEW|g" "$f"
done

echo "Replaced. Verifying…"

LEFT=$(grep -rl "$OLD" . --include='*.html' --include='*.md' 2>/dev/null | grep -v '/\.git/' || true)
if [[ -n "$LEFT" ]]; then
  echo "FAILED — the old address is still present in:" >&2
  echo "$LEFT" >&2
  exit 1
fi

# A mailto whose href and visible text disagree is the silent half-done shape.
BAD=$(grep -rn 'mailto:' . --include='*.html' 2>/dev/null | grep -v '/\.git/' \
      | grep -v "mailto:$NEW\">$NEW" || true)
if [[ -n "$BAD" ]]; then
  echo "WARNING — a mailto link whose href and visible text differ:" >&2
  echo "$BAD" >&2
fi

echo "OK — $NEW is now the only support address ($(grep -rc "$NEW" --include='*.html' . 2>/dev/null | grep -v ':0' | wc -l | tr -d ' ') files)."
echo
echo "Still to do by hand:"
echo "  • App Store Connect → App Information → support contact"
echo "  • Confirm the new mailbox receives AND can send as itself"
