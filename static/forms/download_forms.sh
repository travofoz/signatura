#!/bin/bash
# signatura/static/forms/download_forms.sh

mkdir -p .
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64)"

echo "🔥 Downloading The Complete 55-Form Library..."

# ==========================================
# 1. SHELTER STATE FORMATION (DE, WY, MT, NV)
# ==========================================
echo "   Fetching Shelter State Docs..."
# Delaware
curl -A "$UA" -L -o de-formation.pdf https://corpfiles.delaware.gov/LLCFormation.pdf
curl -A "$UA" -L -o de-cancellation.pdf https://corpfiles.delaware.gov/LLCCancellation.pdf
# Wyoming (Privacy)
curl -A "$UA" -L -o wy-articles.pdf https://sos.wyo.gov/Forms/LimitedLiabilityCompany/LLC-ArticlesOrganization.pdf
curl -A "$UA" -L -o wy-annual-report.pdf https://sos.wyo.gov/Forms/LimitedLiabilityCompany/LLC-AnnualReport.pdf
# Montana (0% Sales Tax)
curl -A "$UA" -L -o mt-articles.pdf https://sosmt.gov/wp-content/uploads/19A-Articles_of_Organization_for_Domestic_LLC.pdf
# Nevada (Asset Protection)
curl -A "$UA" -L -o nv-articles.pdf https://www.nvsos.gov/sos/home/showpublisheddocument/2676/636886470656030000
curl -A "$UA" -L -o nv-initial-list.pdf https://www.nvsos.gov/sos/home/showpublisheddocument/2680/636886472935070000

# ==========================================
# 2. IRS TAX STRATEGY & ELECTIONS
# ==========================================
echo "   Fetching IRS Forms..."
curl -A "$UA" -L -o fw9.pdf https://www.irs.gov/pub/irs-pdf/fw9.pdf
curl -A "$UA" -L -o fss4-ein.pdf https://www.irs.gov/pub/irs-pdf/fss4.pdf
curl -A "$UA" -L -o f2553-scorp.pdf https://www.irs.gov/pub/irs-pdf/f2553.pdf
curl -A "$UA" -L -o f8832-ccorp.pdf https://www.irs.gov/pub/irs-pdf/f8832.pdf
curl -A "$UA" -L -o f15620-83b.pdf https://www.irs.gov/pub/irs-pdf/f15620.pdf
# International Tax
curl -A "$UA" -L -o fw8ben.pdf https://www.irs.gov/pub/irs-pdf/fw8ben.pdf
curl -A "$UA" -L -o fw8bene.pdf https://www.irs.gov/pub/irs-pdf/fw8bene.pdf

# ==========================================
# 3. LLC OPERATIONS & GOVERNANCE
# ==========================================
echo "   Fetching LLC Admin Docs..."
# Operating Agreements
curl -A "$UA" -L -o llc-oa-multi.pdf https://eforms.com/download/2015/11/Multi-Member-LLC-Operating-Agreement.pdf
curl -A "$UA" -L -o llc-oa-single.pdf https://eforms.com/download/2015/11/Single-Member-LLC-Operating-Agreement.pdf
# Maintenance
curl -A "$UA" -L -o llc-joinder.pdf https://images.template.net/wp-content/uploads/2017/05/Joinder-Agreement-Form.pdf
curl -A "$UA" -L -o llc-resolution-banking.pdf https://files.consumerfinance.gov/f/documents/cfpb_unanimous-written-consent-resolutions_2020-09.pdf
curl -A "$UA" -L -o llc-resolution-general.pdf https://www.allbusiness.com/asset/2014/11/Board-Resolution-Approving-Transaction.pdf
curl -A "$UA" -L -o officer-resignation.pdf https://www.lawinsider.com/contracts/5F8i2Zq4Z2Z/download/pdf
curl -A "$UA" -L -o capital-call-notice.pdf https://trustalta.com/wp-content/uploads/2020/03/Capital-Call-Notice-Sample.pdf
curl -A "$UA" -L -o llc-membership-cert.pdf https://www.northwestregisteredagent.com/wp-content/uploads/2019/11/LLC-Membership-Certificate-Free-Template.pdf

# ==========================================
# 4. STARTUP FUNDING & EQUITY
# ==========================================
echo "   Fetching Deal Docs..."
# SAFEs (Y Combinator)
curl -A "$UA" -L -o safe-val-cap.pdf https://www.ycombinator.com/assets/ycdc/Postmoney_Safe_Valuation_Cap_v1.1-112d9d3065275e3c75d4d7a8d9a24d55a2958742546377770851493721344403.pdf
curl -A "$UA" -L -o safe-discount.pdf https://www.ycombinator.com/assets/ycdc/Postmoney_Safe_Discount_Only_v1.1-4c6e4e04005b87c711a6819a84d4b179045763df0238d227b61f9d4e5f784a9e.pdf
curl -A "$UA" -L -o safe-mfn.pdf https://www.ycombinator.com/assets/ycdc/Postmoney_Safe_MFN_Only_v1.1-81534064506c7104d445eb0a9e700b656461c3792c011e40a430541783852882.pdf
# Advisors & Options
curl -A "$UA" -L -o fast-advisor.pdf https://fi.co/system/upload/fast_agreement_template_2.0.pdf
curl -A "$UA" -L -o stock-option-grant.pdf https://www.allbusiness.com/asset/2014/11/Stock-Option-Agreement.pdf
curl -A "$UA" -L -o stock-exercise-notice.pdf https://www.allbusiness.com/asset/2014/11/Notice-of-Exercise-of-Stock-Option.pdf

# ==========================================
# 5. COMMERCIAL CONTRACTS (Common Paper)
# ==========================================
echo "   Fetching Sales Docs..."
curl -A "$UA" -L -o mutual-nda.pdf https://commonpaper.com/wp-content/uploads/2022/09/Common-Paper-Mutual-NDA-Standard-Terms-Version-1.0.pdf
curl -A "$UA" -L -o saas-agreement.pdf https://commonpaper.com/wp-content/uploads/2022/10/Common-Paper-Cloud-Service-Agreement-Standard-Terms-Version-1.0.pdf
curl -A "$UA" -L -o psa-consulting.pdf https://commonpaper.com/wp-content/uploads/2023/04/Common-Paper-Professional-Services-Agreement-Standard-Terms-Version-1.1.pdf
curl -A "$UA" -L -o dpa-data-privacy.pdf https://commonpaper.com/wp-content/uploads/2022/09/Common-Paper-DPA-Standard-Terms-Version-1.0.pdf
curl -A "$UA" -L -o sla-uptime.pdf https://commonpaper.com/wp-content/uploads/2022/09/Common-Paper-SLA-Standard-Terms-Version-1.0.pdf
curl -A "$UA" -L -o referral-agreement.pdf https://signaturely.com/wp-content/uploads/2024/11/Referral-Agreement.pdf
curl -A "$UA" -L -o commission-agreement.pdf https://signaturely.com/wp-content/uploads/2024/11/Sales-Commission-Agreement.pdf

# ==========================================
# 6. HR & EMPLOYMENT
# ==========================================
echo "   Fetching HR Docs..."
# US Federal
curl -A "$UA" -L -o fw4.pdf https://www.irs.gov/pub/irs-pdf/fw4.pdf
curl -A "$UA" -L -o i-9.pdf https://www.uscis.gov/sites/default/files/document/forms/i-9.pdf
curl -A "$UA" -L -o wh-380-e.pdf https://www.dol.gov/sites/dolgov/files/WHD/legacy/files/WH-380-E.pdf
# Contracts
curl -A "$UA" -L -o independent-contractor.pdf https://www.csustan.edu/sites/default/files/groups/Financial%20Services/Purchasing/independent_consultant_agreement_short_form.pdf
curl -A "$UA" -L -o piia-employee.pdf https://www.hbs.edu/entrepreneurship/Documents/confidentiality_and_assignment_agreement.pdf
curl -A "$UA" -L -o offer-letter.pdf https://www.careerplug.com/wp-content/uploads/2021/01/Formal-Offer-Letter-Template.pdf
curl -A "$UA" -L -o termination-letter.pdf https://www.awb.org/wp-content/uploads/2018/05/SAMPLE-AT-WILL-EMPLOYMENT-OFFER-LETTER.pdf
# Admin
curl -A "$UA" -L -o direct-deposit.pdf https://www.dol.gov/sites/dolgov/files/WHD/legacy/files/whd_direct_deposit.pdf
curl -A "$UA" -L -o emergency-contact.pdf https://www.shrm.org/content/dam/shrm/resources/forms/emergency-contact-form.pdf
curl -A "$UA" -L -o background-check-consent.pdf https://files.consumerfinance.gov/f/201509_cfpb_summary_your-rights-under-fcra.pdf # (FCRA Rights Summary - Required to attach to consent)

# ==========================================
# 7. MISC & STATE TAX
# ==========================================
echo "   Fetching Misc..."
curl -A "$UA" -L -o equipment-lease.pdf https://www.labexofma.com/images/forms/Equipment_Lease_Agreement.pdf
curl -A "$UA" -L -o video-release.pdf https://www.si.edu/content/pdf/about/Use_of_Likeness_Release.pdf
curl -A "$UA" -L -o ca-de4.pdf https://edd.ca.gov/siteassets/files/pdf_pub_ctr/de4.pdf
curl -A "$UA" -L -o ny-it2104.pdf https://www.tax.ny.gov/pdf/current_forms/it/it2104_fill_in.pdf

echo "✅ DONE. 55 Forms Downloaded."
