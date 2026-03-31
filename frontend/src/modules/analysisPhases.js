export const analysisPhases = [
  {
    label: "Claim Received",
    detail: "Queuing your request and packaging the claim for the analysis pipeline.",
    activities: [
      "Normalizing the submitted claim text.",
      "Preparing the backend request payload.",
      "Dispatching the analysis job to the local pipeline.",
    ],
  },
  {
    label: "Searching Sources",
    detail: "Gathering live web context and source signals to ground the investigation.",
    activities: [
      "Issuing the live search query.",
      "Collecting source snippets and coverage signals.",
      "Filtering weak or repetitive source matches.",
    ],
  },
  {
    label: "Checking Facts",
    detail: "Reviewing prior context and extracting evidence, contradictions, and open questions.",
    activities: [
      "Looking up relevant prior-chat context.",
      "Extracting evidence and contradictions.",
      "Separating supported claims from open questions.",
    ],
  },
  {
    label: "Testing Logic",
    detail: "Looking for assumptions, weaknesses, and whether the evidence really supports the claim.",
    activities: [
      "Checking whether the conclusion follows from the evidence.",
      "Flagging assumptions and weak inferences.",
      "Scanning for common fallacy patterns.",
    ],
  },
  {
    label: "Model Reflection",
    detail: "Building the anatomy of belief and assembling the context tree.",
    activities: [
      "Mapping why the claim feels persuasive.",
      "Identifying emotional and cognitive drivers.",
      "Assembling the context tree from node outputs.",
    ],
  },
  {
    label: "Final Verdict",
    detail: "Combining everything into a confidence score, verdict, and report summary.",
    activities: [
      "Synthesizing all node outputs into one report.",
      "Scoring confidence based on evidence quality.",
      "Preparing the final structured response.",
    ],
  },
];
