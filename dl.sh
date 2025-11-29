mkdir -p static/forms
cd static/forms

# Government Forms
curl -L -o fw9.pdf https://www.irs.gov/pub/irs-pdf/fw9.pdf
curl -L -o fw4.pdf https://www.irs.gov/pub/irs-pdf/fw4.pdf
curl -L -o f15620.pdf https://www.irs.gov/pub/irs-pdf/f15620.pdf
curl -L -o fss4.pdf https://www.irs.gov/pub/irs-pdf/fss4.pdf
curl -L -o wh-380-e.pdf https://www.dol.gov/sites/dolgov/files/WHD/legacy/files/WH-380-E.pdf

# USCIS I-9 often blocks curl without a user agent, so we fake one
curl -A "Mozilla/5.0" -L -o i-9.pdf https://www.uscis.gov/sites/default/files/document/forms/i-9.pdf

# Common Paper Standards
curl -L -o mutual-nda.pdf https://commonpaper.com/wp-content/uploads/2022/09/Common-Paper-Mutual-NDA-Standard-Terms-Version-1.0.pdf

echo "All forms downloaded to static/forms/"
