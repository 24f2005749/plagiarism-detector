import { BarChart3, Brain, FileText, Grid2X2, Languages, ShieldCheck } from "lucide-react";

function Help() {
  return (
    <>
      <header className="help-header">
        <div className="header-content">
          <h1>Help & About</h1>
          <p>Understand what PLAGCOM measures and how to read an analysis.</p>
        </div>
      </header>

      <main className="help-content">
        <section className="help-intro-card">
          <ShieldCheck size={28} />
          <div>
            <h2>What PLAGCOM does</h2>
            <p>
              PLAGCOM compares the submitted files in pairs. It looks for both similar wording and similar meaning,
              then combines those signals into a pair similarity score and a suggested risk level. It is an evidence
              tool: use its findings to guide review, not as an automatic finding of misconduct.
            </p>
          </div>
        </section>

        <section className="help-section">
          <h2>How scores work</h2>
          <div className="help-grid">
            <HelpCard icon={BarChart3} title="Pair similarity">
              A percentage for one file compared with another. Higher values mean the tools found more overlapping
              evidence. It is not a percentage of a document that was copied.
            </HelpCard>
            <HelpCard icon={Brain} title="Semantic analysis">
              Compares meaning using a language model. It can find similar ideas even when wording is changed, so it
              is useful for spotting paraphrasing.
            </HelpCard>
            <HelpCard icon={Languages} title="Lexical analysis">
              Compares words, word order, and phrase overlap. A high lexical score is stronger evidence of closely
              shared wording.
            </HelpCard>
            <HelpCard icon={FileText} title="Sentence evidence">
              Shows how many source sentences had a close counterpart, plus the highest and average best sentence
              match. It helps reveal whether overlap is isolated or repeated through a file.
            </HelpCard>
          </div>
        </section>

        <section className="help-section">
          <h2>Understanding the result</h2>
          <div className="interpretation-list">
            <div><strong>Low / very low risk</strong><span>Little supporting evidence of meaningful overlap was found.</span></div>
            <div><strong>Moderate risk</strong><span>Some evidence deserves a quick review, especially where subjects or sources overlap.</span></div>
            <div><strong>High / critical risk</strong><span>Multiple signals agree on substantial similarity. Review the matched content and its citation context.</span></div>
          </div>
        </section>

        <section className="help-section">
          <h2>Using the file heatmap</h2>
          <div className="heatmap-help">
            <Grid2X2 size={24} />
            <p>
              When you upload more than two files, there is no one overall plagiarism score for the batch. The heatmap
              shows every file pair: find a row and column intersection to see that pair’s similarity. Cooler colors
              indicate lower similarity; warmer colors indicate higher similarity. The diagonal is neutral because a
              file is always identical to itself.
            </p>
          </div>
        </section>

        <section className="help-note">
          <h2>Good review practice</h2>
          <p>
            Open the original documents, read the surrounding context, and check quotations, common terminology,
            templates, and references before drawing a conclusion. Similarity can be legitimate.
          </p>
        </section>
      </main>
    </>
  );
}

function HelpCard({ icon: Icon, title, children }) {
  return (
    <article className="help-card">
      <Icon size={20} />
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  );
}

export default Help;
