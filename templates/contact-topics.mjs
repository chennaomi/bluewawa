// Stable, public topic IDs. Only these values may preselect the contact form.
export const contactTopics = {
  'rednote-vs-wechat': {
    label: 'Choosing Rednote or WeChat',
    cta: 'Discuss your platform choice',
    prompt: 'Tell us who you want to reach and what you want them to do next.'
  },
  'rednote-content-localization': {
    label: 'Rednote content localization',
    cta: 'Discuss your content brief',
    prompt: 'Tell us about your audience, existing assets and the content you need to adapt.'
  },
  'wechat-launch-checklist': {
    label: 'WeChat launch planning',
    cta: 'Discuss your WeChat launch',
    prompt: 'Share your account status, intended customer journey and what is ready for launch.'
  },
  'rednote-keyword-research': {
    label: 'Rednote keyword research',
    cta: 'Discuss your research scope',
    prompt: 'Describe your category, audience and the questions your content should answer.'
  },
  'rednote-creator-brief': {
    label: 'Rednote creator collaboration',
    cta: 'Discuss your creator brief',
    prompt: 'Share the content idea, proposed deliverables and any creator or production constraints.'
  },
  'wechat-content-calendar': {
    label: 'WeChat content planning',
    cta: 'Discuss your WeChat content plan',
    prompt: 'Tell us about your customer journey, available assets and review capacity.'
  },
  'rednote-marketing-costs': {
    label: 'Rednote budget and scope',
    cta: 'Discuss your budget and scope',
    prompt: 'Share your intended scope, timing and budget constraints, if you have them.'
  },
  'rednote-90-day-pilot': {
    label: 'Rednote pilot planning',
    cta: 'Discuss your pilot plan',
    prompt: 'What should a first pilot help you learn, and what can your team support?'
  },
  'evaluate-china-social-media-agency': {
    label: 'Agency fit and delivery scope',
    cta: 'Discuss your delivery requirements',
    prompt: 'Share your priorities, required deliverables and the evidence you need to assess fit.'
  }
};

export const contactHref = article => article && contactTopics[article.slug]
  ? `/?topic=${encodeURIComponent(article.slug)}#contact`
  : '/#contact';
