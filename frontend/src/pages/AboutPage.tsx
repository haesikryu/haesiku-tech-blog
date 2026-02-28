import { aboutData } from '@/data/about';
import { Seo } from '@/components/common';

function Section({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
        <span aria-hidden>{icon}</span>
        {title}
      </h2>
      <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800/50">
        {children}
      </div>
    </section>
  );
}

export default function AboutPage() {
  const { introduction, expertise, blogActivity, publications, teaching, career, vision } = aboutData;

  return (
    <>
      <Seo
        title="About | 유해식"
        description={`${introduction.greeting} ${introduction.paragraphs[0].slice(0, 120)}...`}
      />

      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">About</h1>

        {/* 소개 */}
        <Section icon="👋" title="소개">
          <p className="mb-3 text-lg font-medium text-gray-800 dark:text-gray-200">
            {introduction.greeting}
          </p>
          {introduction.paragraphs.map((p, i) => (
            <p key={i} className="mb-3 leading-relaxed text-gray-700 dark:text-gray-300">
              {p}
            </p>
          ))}
        </Section>

        {/* 전문 분야 */}
        <Section icon="🎯" title="전문 분야">
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                핵심 영역
              </h3>
              <ul className="list-inside list-disc space-y-1 text-gray-700 dark:text-gray-300">
                {expertise.coreAreas.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                보유 기술
              </h3>
              <ul className="space-y-1.5 text-gray-700 dark:text-gray-300">
                {expertise.skills.map((group, i) => (
                  <li key={i}>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {group.category}:
                    </span>{' '}
                    {group.items.join(', ')}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                인증 & 자격
              </h3>
              <ul className="list-inside list-disc space-y-1 text-gray-700 dark:text-gray-300">
                {expertise.certifications.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* 기술 블로그 활동 */}
        <Section icon="📊" title="기술 블로그 활동">
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                주요 관심 주제
              </h3>
              <ul className="list-inside list-disc space-y-1 text-gray-700 dark:text-gray-300">
                {blogActivity.topics.map((topic, i) => (
                  <li key={i}>{topic}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                콘텐츠 특징
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                {blogActivity.features.map((f, i) => (
                  <li key={i}>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{f.title}:</span>{' '}
                    {f.description}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* 저서 & 출간물 */}
        <Section icon="📖" title="저서 & 출간물">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            📘 출간 도서
          </h3>
          {publications.map((pub, i) => (
            <div
              key={i}
              className="rounded border border-gray-100 p-4 dark:border-gray-600 dark:bg-gray-800/30"
            >
              <p className="font-semibold text-gray-900 dark:text-white">{pub.title}</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                출판사: {pub.publisher} · 출간년도: {pub.year}
              </p>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                주요 내용: {pub.description}
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                독자 대상: {pub.audience}
              </p>
            </div>
          ))}
        </Section>

        {/* 강연 & 교육 활동 */}
        <Section icon="🎤" title="강연 & 교육 활동">
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                정규 교육 과정
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                {teaching.regular.map((item, i) => (
                  <li key={i}>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{item.title}</span>
                    {' — '}
                    {item.description}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                멘토링 활동 (2021 ~ 현재)
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                {teaching.mentoring.map((item, i) => (
                  <li key={i}>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{item.title}</span>
                    {item.period && ` (${item.period})`}
                    {item.description && ` — ${item.description}`}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* 주요 경력 & 프로젝트 */}
        <Section icon="💼" title="주요 경력 & 프로젝트">
          <div className="space-y-5">
            <div>
              <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
                현재 ({career.current.company}, {career.current.period})
              </h3>
              <p className="mb-2 text-gray-700 dark:text-gray-300">{career.current.role}</p>
              <ul className="list-inside list-disc space-y-0.5 text-sm text-gray-600 dark:text-gray-400">
                {career.current.projects.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
                이전 경력 ({career.previous.company}, {career.previous.period})
              </h3>
              <p className="mb-2 text-gray-700 dark:text-gray-300">{career.previous.role}</p>
              <ul className="list-inside list-disc space-y-0.5 text-sm text-gray-600 dark:text-gray-400">
                {career.previous.projects.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                협업 가능 영역
              </h3>
              <ul className="list-inside list-disc space-y-0.5 text-gray-700 dark:text-gray-300">
                {career.collaboration.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* 장기 비전 */}
        <Section icon="✨" title="장기 비전">
          <div className="space-y-3">
            {vision.map((v, i) => (
              <p
                key={i}
                className="italic leading-relaxed text-gray-700 dark:text-gray-300"
              >
                {v}
              </p>
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}
