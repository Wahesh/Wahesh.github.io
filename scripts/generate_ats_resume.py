#!/usr/bin/env python3
"""
Generate a single-column, ATS-friendly PDF resume (standard fonts, no graphics).
Edit the data below and run: python3 scripts/generate_ats_resume.py
Requires: pip install fpdf2
"""
import shutil
from pathlib import Path

from fpdf import FPDF
from fpdf.enums import Align, XPos, YPos

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "Mahesh-Dahal-Resume.pdf"
OUT_LEGACY = ROOT / "resume" / "Mahesh-Dahal-Resume.pdf"


class ResumePDF(FPDF):
    def footer(self) -> None:
        self.set_y(-12)
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(80, 80, 80)
        self.cell(0, 8, f"Page {self.page_no()}", align=Align.L)


def mcell(pdf: FPDF, h: float, text: str) -> None:
    """Left-aligned block; cursor returns to left margin for the next line (fpdf2 defaults break this)."""
    pdf.multi_cell(
        pdf.epw,
        h,
        text,
        align=Align.L,
        new_x=XPos.LMARGIN,
        new_y=YPos.NEXT,
    )


def section_title(pdf: FPDF, title: str) -> None:
    pdf.ln(4)
    pdf.set_x(pdf.l_margin)
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(0, 0, 0)
    mcell(pdf, 5, title.upper())
    pdf.set_font("Helvetica", "", 9)
    pdf.ln(1)


def paragraph(pdf: FPDF, text: str) -> None:
    pdf.set_x(pdf.l_margin)
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(30, 30, 30)
    mcell(pdf, 4.2, text)
    pdf.ln(1)


def job(
    pdf: FPDF,
    company: str,
    title: str,
    when_where: str,
    bullets: list[str],
) -> None:
    pdf.set_x(pdf.l_margin)
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(0, 0, 0)
    mcell(pdf, 4.5, company)
    pdf.set_font("Helvetica", "B", 9)
    mcell(pdf, 4.2, title)
    pdf.set_font("Helvetica", "I", 9)
    pdf.set_text_color(60, 60, 60)
    mcell(pdf, 4, when_where)
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(30, 30, 30)
    for line in bullets:
        pdf.set_x(pdf.l_margin)
        mcell(pdf, 4.2, f"- {line}")
    pdf.ln(1.5)


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT_LEGACY.parent.mkdir(parents=True, exist_ok=True)

    pdf = ResumePDF()
    pdf.set_margins(left=18, top=18, right=18)
    pdf.set_auto_page_break(auto=True, margin=16)
    pdf.add_page()
    pdf.set_text_color(0, 0, 0)
    pdf.set_x(pdf.l_margin)

    # --- Header (all left-aligned) ---
    pdf.set_font("Helvetica", "B", 16)
    mcell(pdf, 7, "MAHESH DAHAL")
    pdf.set_font("Helvetica", "", 11)
    mcell(pdf, 5, "Growth and Operations Manager")
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(45, 45, 45)
    mcell(
        pdf,
        4,
        "Nepal | https://wahesh.github.io/ | "
        "https://www.linkedin.com/in/maheshdahal/ | https://github.com/wahesh",
    )
    pdf.set_text_color(0, 0, 0)
    pdf.ln(2)

    section_title(pdf, "Professional Summary")
    paragraph(
        pdf,
        "Operations and growth leader with 12+ years across startups, enterprise security (SIEM), "
        "IoMT, international development, and cloud adoption. Builds systems that turn growth plans "
        "into predictable execution: AI-led compliance for SaaS, partnerships, GTM cadence, and "
        "lean operations. Strengths: rapid prototyping, IoT, cybersecurity, VAPT-style work with "
        "responsible disclosure, product and project management, Python and JavaScript (pipelines, "
        "automation, APIs), Azure and AWS. Arctic Code Vault Contributor; merged open-source work "
        "to Canonical and WordPress ecosystem repositories.",
    )

    section_title(pdf, "Professional Experience")

    job(
        pdf,
        "ZeroTB",
        "Growth and Operations Manager",
        "August 2025 - Present | Nepal",
        [
            "Coordinate engineering and delivery, project management, and day-to-day operations "
            "and GTM for AI-led compliance at a startup.",
            "Partnerships, internal cadence, and scalability of information-services offerings.",
            "Finance-adjacent support: budget inputs, forecasting, lean ops for measurable outcomes.",
        ],
    )
    job(
        pdf,
        "UNICEF",
        "Assessment Specialist",
        "February 2024 - August 2025 | Nepal",
        [
            "Led national school-readiness assessment across 280 schools (probability-based sampling, "
            "rigorous field protocols).",
            "Instrument quality (IRR, CVI), enumerator training, analysis in Python and R; "
            "co-authored published report for policy dialogue.",
        ],
    )
    job(
        pdf,
        "Logpoint",
        "Engineering Manager",
        "April 2023 - February 2024 | Kathmandu, Nepal",
        [
            "Engineering delivery for converged SIEM and security analytics in a global product org.",
            "Log normalization, correlation content, release quality under enterprise expectations; "
            "mentored engineers and balanced roadmap with sustainable execution.",
        ],
    )
    job(
        pdf,
        "Kipuwex",
        "Software Engineering Manager",
        "June 2019 - March 2022 | Finland",
        [
            "IoMT: wearables and gateways streaming body data; stream analytics, alarms, remote "
            "health monitoring beyond dashboards.",
            "Led team of five: Flutter, Node, React on AWS; SLAs, releases, documentation, hiring; "
            "aligned engineering with clinical and customer success.",
        ],
    )
    job(
        pdf,
        "Graphene Inc.",
        "Chief Technology Officer",
        "July 2020 - February 2021 | Kathmandu, Nepal",
        [
            "R&D for NLTK-based news aggregator with sentiment and keyword intelligence; hands-on "
            "pipelines and early-stage trade-offs.",
            "Mentored team; aligned technical bets with founder priorities.",
        ],
    )
    job(
        pdf,
        "UNICEF",
        "IT Consultant",
        "September 2017 - December 2019 | Kathmandu, Nepal",
        [
            "Reconstruction information-management systems with Ministry of Education and NRA post-earthquake.",
            "Dashboards, RBAC, workflows for field and central teams; training and iterative rollout "
            "with government and NGO partners.",
        ],
    )
    job(
        pdf,
        "Microsoft Innovation Center Nepal",
        "Microsoft Azure Evangelist",
        "January 2011 - August 2015 | Nepal",
        [
            "Azure adoption via programmes, workshops, labs for MSPs and ISVs (100+ partners).",
            "Architecture reviews and pilots (e.g., AEPC, Nepal Biogas); shaped local cloud narrative.",
        ],
    )
    job(
        pdf,
        "BrainWorks Learning Solutions",
        "Technical Consultant",
        "January 2011 - July 2015 | Kathmandu, Nepal",
        [
            "Dynamics NAV and Azure-backed solutions for health, energy, and development programmes.",
            "End-to-end rollouts including Unlimited Drishtee, Urza, Sarsaaman, Surackshya; training "
            "and handover.",
        ],
    )

    section_title(pdf, "Education")
    pdf.set_font("Helvetica", "", 9)
    entries = [
        "Executive Education, Leading for Innovation - Lee Kuan Yew School of Public Policy (NUS), 2021",
        "Higher Diploma, Research and Writing - The Open Institute, 2023-2024",
        "MBA, Entrepreneurship - Westcliff University (King's College, Nepal), 2016-2018",
        "Bachelor of Information Technology - Sikkim Manipal University, 2011-2015",
        "Design Thinking (DevLAB) - Oulu University of Applied Sciences, 2018",
        "Intermediate in Engineering (NLP, Visual Programming) - Thapathali Campus, 2008-2011 "
        "(Best Project, 3rd at LOCUS)",
    ]
    for line in entries:
        pdf.set_x(pdf.l_margin)
        mcell(pdf, 4.2, f"- {line}")
    pdf.ln(1)

    section_title(pdf, "Skills")
    paragraph(
        pdf,
        "Rapid prototyping, IoT, cybersecurity, VAPT, responsible disclosure, product management, "
        "project management, Agile, Scrum, operations, engineering, analytics, compliance, LLM, AI, ISO and SOC 2 "
        "audit readiness, partnerships, GTM, Python, JavaScript, R, React, AWS, Microsoft Azure, "
        "Dynamics NAV, information management, research, SIEM, data pipelines, automation.",
    )

    section_title(pdf, "Certifications")
    for c in [
        "Microsoft MVP; Microsoft Certified Trainer (MCT)",
        "Azure IaaS Deep Dive; Microsoft Certified Professional",
        "HTML5, JavaScript, CSS3; SQL Server; Dynamics NAV",
    ]:
        pdf.set_x(pdf.l_margin)
        pdf.set_font("Helvetica", "", 9)
        mcell(pdf, 4.2, f"- {c}")
    pdf.ln(1)

    section_title(pdf, "Selected Projects")
    projects = [
        "Fleet GPS and telematics: embedded devices to cloud, live tracking, alerts, fuel monitoring.",
        "Kipuwex IoMT: Flutter, Node, React, AWS; real-time vitals and clinical workflows.",
        "Rental management SaaS: payments, tenants, maintenance, marketplace integrations.",
        "Race registration and timing: IoT edge for reads and official results.",
        "AI news aggregator: ingest, dedupe, NLP summaries, sentiment, keyword alerts.",
        "Open source: Canonical (e.g., charm-eng-releases) and WordPress project repositories.",
        "UNDP Turkey: conflict threat monitoring (Telegram, OSINT) for situational awareness.",
        "Enterprise delivery: Unlimited Sarsaaman (ArmyNet), Urza (biogas/Azure), Drishtee (EMR), "
        "Surackshya (GGMS); Aawaz (UNICEF, Windows Phone offline reporting).",
    ]
    for line in projects:
        pdf.set_x(pdf.l_margin)
        mcell(pdf, 4.2, f"- {line}")
    pdf.ln(1)

    section_title(pdf, "Honors and Publications")
    for line in [
        "Microsoft MVP (2016); MSP of the Year, Microsoft Nepal (2011); Second Runner Up, LOCUS NLP "
        "and voice, IOE Pulchowk (2011); Microsoft Student Partner; Canonical contributor (merged PR).",
        "School Readiness Report 2080 (Nov 2024): 280 schools, ELDS tools, CVI and IRR; policy benchmarks.",
        "Azure and SQL technical articles on SlideShare (2014): 70-533, Azure infrastructure, SQL mirroring.",
    ]:
        pdf.set_x(pdf.l_margin)
        mcell(pdf, 4.2, f"- {line}")

    pdf.output(str(OUT))
    shutil.copy2(OUT, OUT_LEGACY)
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")
    print(f"Copied to {OUT_LEGACY}")


if __name__ == "__main__":
    main()
