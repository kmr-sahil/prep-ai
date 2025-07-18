import jsPDF from "jspdf";

type Feedback = {
  feedback: string;
  soi: string;
  tips: string[];
  score: number;
};

export const generateFeedbackPDF = (
  questions: string[],
  answers: string[],
  feedback: Feedback
) => {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const maxLineWidth = pageWidth - 28; // 14px margin on both sides

  // Add Prep-AI branding title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Prep-AI - Mock Interview Report", 14, 20);

  // Reset font for content
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");

  let y = 30;

  // Questions & Answers
  questions.forEach((question, index) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    const answer = answers[index] || "Not Answered";

    doc.setFont(undefined as any, "bold");
    const questionLines = doc.splitTextToSize(`Q${index + 1}: ${question}`, maxLineWidth);
    doc.text(questionLines, 14, y);
    y += questionLines.length * 6;

    doc.setFont(undefined as any, "normal");
    const answerLines = doc.splitTextToSize(`Ans: ${answer}`, maxLineWidth);
    doc.text(answerLines, 18, y);
    y += answerLines.length * 6 + 4;
  });

  // Final Feedback section
  doc.setFont("helvetica", "bold");
  doc.text("Final Feedback", 14, y);
  y += 8;
  doc.setFont("helvetica", "normal");

  const feedbackLines = doc.splitTextToSize(`Feedback: ${feedback.feedback}`, maxLineWidth);
  doc.text(feedbackLines, 14, y);
  y += feedbackLines.length * 6;

  const soiLines = doc.splitTextToSize(`Scope of Improvement: ${feedback.soi}`, maxLineWidth);
  doc.text(soiLines, 14, y);
  y += soiLines.length * 6;

  doc.text(`Score: ${feedback.score}/10`, 14, y);
  y += 10;

  doc.text("Tips to Improve:", 14, y);
  y += 6;

  feedback.tips.forEach((tip) => {
    const tipLines = doc.splitTextToSize(`• ${tip}`, maxLineWidth - 4);
    doc.text(tipLines, 18, y);
    y += tipLines.length * 6;
  });

  doc.save("prep-ai-feedback.pdf");
};
