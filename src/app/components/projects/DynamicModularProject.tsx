import { ProjectDetailTemplate } from './ProjectDetailTemplate';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import { cldImage } from '@/app/lib/cloudinary';

const PROJECT_FOLDER = 'portfolio/dynamic-modular';
const heroImage = cldImage(`${PROJECT_FOLDER}/hero`);
const maskImage = cldImage(`${PROJECT_FOLDER}/mask`);
const targetImage = cldImage(`${PROJECT_FOLDER}/target`);
const conceptUnitImage = cldImage(`${PROJECT_FOLDER}/concept-unit`);
const conceptModuleRailImage = cldImage(`${PROJECT_FOLDER}/concept-module-rail`);
const unit1Image = cldImage(`${PROJECT_FOLDER}/unit-1`);
const unit2Image = cldImage(`${PROJECT_FOLDER}/unit-2`);
const unit3Image = cldImage(`${PROJECT_FOLDER}/unit-3`);
const floor5Image = cldImage(`${PROJECT_FOLDER}/floor-5`);
const floor6Image = cldImage(`${PROJECT_FOLDER}/floor-6`);
const floor7Image = cldImage(`${PROJECT_FOLDER}/floor-7`);
const unitCombinesImage = cldImage(`${PROJECT_FOLDER}/unit-combines`);
const render1Image = cldImage(`${PROJECT_FOLDER}/render-1`);
const render2Image = cldImage(`${PROJECT_FOLDER}/render-2`);
const render3Image = cldImage(`${PROJECT_FOLDER}/render-3`);

export function DynamicModularProject() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ProjectDetailTemplate
      projectId="dynamic-modular"
      title="Dynamic Modular Bio-Incubation Center"
      subtitle="다이나믹 모듈러 바이오 인큐베이션 센터"
      category="Design Project"
      year="2024"
      location="Seoul, Korea"
      area="2,500 ㎡"
      description="다이나믹 모듈러 바이오 인큐베이션 센터는 연구 목표, 실험 방법, 팀 구성에 따라 유연하게 변화할 수 있도록 설계되었습니다. 이 공간은 실험실, 사무실, 회의실, 커뮤니티 존과 같은 고정된 배치를 따르지 않습니다. 대신 필요에 따라 확장하거나 분리하고, 다시 통합할 수 있는 모듈형 구조와 레일 시스템으로 구성되어 연구 환경을 자유롭게 조정할 수 있습니다."
      heroImage={heroImage}
    >
      {/* Background & Target Section - Side by Side */}
      <section className="mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-0 lg:gap-16">
          {/* Background */}
          <div className="lg:col-span-4 flex flex-col">
            <motion.h2
              className="text-[#1A1A1A] mb-6"
              style={{
                fontFamily: 'Inter, Pretendard, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Background
            </motion.h2>
            <div className="w-full h-px bg-[#E0E0E0] mb-10" />

            <div className="flex-1 flex flex-col">
              <motion.div
                className="mb-8 flex-1 flex items-center justify-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={maskImage}
                    alt="마스크 이미지"
                    className="w-full max-w-[240px] h-auto object-contain mx-auto"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <p
                  className="text-[#1A1A1A] mb-8"
                  style={{
                    fontFamily: 'Inter, Pretendard, sans-serif',
                    fontWeight: 300,
                    fontSize: '15px',
                    lineHeight: '2',
                    letterSpacing: '0.01em',
                  }}
                >
                  코로나19 이후, mRNA 백신 기술은 전 세계적으로 급속도로 발전하며 감염병 대응의 핵심 기술로 자리잡았습니다.
                  각 상황의 요구에 따라 확장과 이전이 가능한 공간이 필요하며, 이를 위해 모듈식 건축 기법을 적용한 유연한 공간 설계를 제안합니다.
                </p>
                <div className="w-12 h-px bg-[#5bc0cc]" />
              </motion.div>
            </div>
          </div>

          {/* Target */}
          <div className="lg:col-span-6 flex flex-col">
            <motion.h2
              className="text-[#1A1A1A] mb-6"
              style={{
                fontFamily: 'Inter, Pretendard, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Target
            </motion.h2>
            <div className="w-full h-px bg-[#E0E0E0] mb-10" />

            {/* 3-column grid: 다이어그램 | 타이틀 | 설명 */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-0">
              {/* 왼쪽: 다이어그램 */}
              <motion.div
                className="flex items-center justify-center border-r border-[#E0E0E0] pr-6"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <img
                  src={targetImage}
                  alt="타겟 다이어그램"
                  className="w-full max-w-[220px] object-contain"
                />
              </motion.div>

              {/* 중앙: 타이틀 세로 삼분할 + 오른쪽: 설명 세로 삼분할 */}
              {/* 중앙+오른쪽을 하나의 영역으로 묶어서 row 단위로 정렬 */}
              <div className="md:col-span-2 flex flex-col divide-y divide-[#E0E0E0]">
                {[
                  {
                    label: '스타트업',
                    number: '01',
                    desc: '성장 추세를 반영하는 유연한 실험 플랫폼이 필요한 사용자들로 실험실·회의실·클린룸 등 다양한 기능을 활용할 수 있는 유연성이 필요한 자들을 의미합니다.',
                  },
                  {
                    label: '전문 연구원',
                    number: '02',
                    desc: '기술 교류, 공동 연구, 교육, 경험을 통해 공간에 참여하는 사용자. 여기에는 외부 전문가와 교육 기관이 포함됩니다.',
                  },
                  {
                    label: '정부, 투자자',
                    number: '03',
                    desc: '기술 역량과 협업 흐름을 이해하고 지원하는 투자자, 정부 기관, 운영 조직 등을 포함합니다.',
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.number}
                    className="grid grid-cols-[120px_1fr] gap-4 py-6 first:pt-0 last:pb-0"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.12 }}
                  >
                    {/* 타이틀 */}
                    <div className="flex flex-col justify-center pl-6">
                      <span
                        className="text-[#5bc0cc] mb-2"
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 500,
                          fontSize: '11px',
                          letterSpacing: '0.1em',
                        }}
                      >
                        {item.number}
                      </span>
                      <h3
                        className="text-[#1A1A1A]"
                        style={{
                          fontFamily: 'Inter, Pretendard, sans-serif',
                          fontWeight: 600,
                          fontSize: '15px',
                          letterSpacing: '0.01em',
                        }}
                      >
                        {item.label}
                      </h3>
                    </div>
                    {/* 설명 */}
                    <div className="flex items-center">
                      <p
                        className="text-[#666666]"
                        style={{
                          fontFamily: 'Inter, Pretendard, sans-serif',
                          fontWeight: 300,
                          fontSize: '13px',
                          lineHeight: '1.8',
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Concept Section */}
      <section className="mb-32">
        <motion.h2
          className="text-[#1A1A1A] mb-6"
          style={{
            fontFamily: 'Inter, Pretendard, sans-serif',
            fontWeight: 600,
            fontSize: '13px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Concept
        </motion.h2>
        <div className="w-full h-px bg-[#E0E0E0] mb-12" />

        {/* 컨셉 키워드 */}
        <motion.div
          className="mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p
            className="text-[#5bc0cc] mb-4"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: '12px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            Core Concept
          </p>
          <h3
            className="text-[#1A1A1A]"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontWeight: 600,
              fontSize: '32px',
              lineHeight: '1.3',
              letterSpacing: '-0.01em',
            }}
          >
            레일 모듈식 유닛 설계
          </h3>
        </motion.div>

        {/* 모듈과 레일 시스템 + UNIT ELEV - 가로 배치 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <div className="flex items-start">
              <img
                src={conceptModuleRailImage}
                alt="모듈과 레일 시스템"
                className="w-full object-contain"
              />
            </div>
            <p
              className="text-[#999999] mt-4 text-center"
              style={{
                fontFamily: 'Inter, Pretendard, sans-serif',
                fontWeight: 400,
                fontSize: '12px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Module & Rail System
            </p>
          </div>
          <div>
            <div className="flex items-end justify-end h-full mb-4">
              <img
                src={conceptUnitImage}
                alt="UNIT ELEV"
                className="w-3/5 object-contain"
              />
            </div>
            <p
              className="text-[#999999] mt-4 text-right pr-[20%]"
              style={{
                fontFamily: 'Inter, Pretendard, sans-serif',
                fontWeight: 400,
                fontSize: '12px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Unit Elevation
            </p>
          </div>
        </motion.div>
      </section>

      {/* Units Section */}
      <section className="mb-32">
        <motion.h2
          className="text-[#1A1A1A] mb-6"
          style={{
            fontFamily: 'Inter, Pretendard, sans-serif',
            fontWeight: 600,
            fontSize: '13px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Units
        </motion.h2>
        <div className="w-full h-px bg-[#E0E0E0] mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              image: unit1Image,
              label: '1. 실험실 UNIT',
              desc: '큰 테이블과 여섯 개의 의자, 실험 장비가 배치되어 연구를 위한 실험을 수행할 수 있는 실험실 단위 공간입니다.',
            },
            {
              image: unit2Image,
              label: '2. 연구실 UNIT',
              desc: '연구에 필요한 데이터를 조사하는 단위로, 책상 하나, 컴퓨터 네 대, 책장 두 개로 구성됩니다.',
            },
            {
              image: unit3Image,
              label: '3. 다목적 UNIT',
              desc: '여러 용도로 사용할 수 있으며 변형이 가능한 단위입니다. 예를 들어 휴식 공간, 전시 공간, 회의실 등으로 활용할 수 있습니다.',
            },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <div className="mb-6 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-full object-cover object-top"
                  style={{ aspectRatio: '1 / 0.85' }}
                />
              </div>
              <h3
                className="text-[#1A1A1A] mb-3"
                style={{
                  fontFamily: 'Inter, Pretendard, sans-serif',
                  fontWeight: 600,
                  fontSize: '15px',
                  letterSpacing: '0.01em',
                }}
              >
                {item.label}
              </h3>
              <p
                className="text-[#666666]"
                style={{
                  fontFamily: 'Inter, Pretendard, sans-serif',
                  fontWeight: 300,
                  fontSize: '13px',
                  lineHeight: '1.8',
                }}
              >
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Unit Combines Section */}
      <section className="mb-32">
        <motion.h2
          className="text-[#1A1A1A] mb-6"
          style={{
            fontFamily: 'Inter, Pretendard, sans-serif',
            fontWeight: 600,
            fontSize: '13px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Unit Combines
        </motion.h2>
        <div className="w-full h-px bg-[#E0E0E0] mb-12" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={unitCombinesImage}
            alt="Unit Combines"
            className="w-full object-contain"
          />
        </motion.div>
      </section>

      {/* Floor Plans Section */}
      <section className="mb-32">
        <motion.h2
          className="text-[#1A1A1A] mb-6"
          style={{
            fontFamily: 'Inter, Pretendard, sans-serif',
            fontWeight: 600,
            fontSize: '13px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Floor Plans
        </motion.h2>
        <div className="w-full h-px bg-[#E0E0E0] mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              image: floor7Image,
              floor: '5F',
              rooms: ['Office space', 'Storage', 'Break room', 'Rest room', 'Research lab module ×8'],
            },
            {
              image: floor6Image,
              floor: '6F',
              rooms: ['Office space', 'Storage', 'Break room', 'Rest room', 'Research lab module ×1', 'Laboratory module ×5', 'Multipurpose module ×2'],
            },
            {
              image: floor5Image,
              floor: '7F',
              rooms: ['Office space', 'Storage', 'Break room', 'Rest room', 'Research lab module ×2', 'Multipurpose module ×6'],
            },
          ].map((item, i) => (
            <motion.div
              key={item.floor}
              className="flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <div className="mb-6">
                <img
                  src={item.image}
                  alt={`${item.floor} 평면도`}
                  className="w-full object-contain"
                />
              </div>
              <span
                className="text-[#5bc0cc] mb-1"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}
              >
                Floor
              </span>
              <h3
                className="text-[#1A1A1A] mb-4"
                style={{
                  fontFamily: 'Inter, Pretendard, sans-serif',
                  fontWeight: 600,
                  fontSize: '24px',
                  letterSpacing: '-0.01em',
                }}
              >
                {item.floor}
              </h3>
              <div className="w-8 h-px bg-[#E0E0E0] mb-4" />
              <ul className="flex flex-col gap-2">
                {item.rooms.map((room) => (
                  <li
                    key={room}
                    className="text-[#666666]"
                    style={{
                      fontFamily: 'Inter, Pretendard, sans-serif',
                      fontWeight: 300,
                      fontSize: '13px',
                      lineHeight: '1.6',
                    }}
                  >
                    {room}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3D Renders Section */}
      <section className="mb-32">
        <motion.h2
          className="text-[#1A1A1A] mb-6"
          style={{
            fontFamily: 'Inter, Pretendard, sans-serif',
            fontWeight: 600,
            fontSize: '13px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          3D Renders
        </motion.h2>
        <div className="w-full h-px bg-[#E0E0E0] mb-12" />

        {/* Free-form mosaic layout */}
        <div className="grid grid-cols-12 gap-4">
          {/* Large image - spans 7 columns */}
          <motion.div
            className="col-span-12 md:col-span-7 overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <img
              src={render1Image}
              alt="3D Render - Research Lab"
              className="w-full h-full object-cover"
              style={{ aspectRatio: '16 / 10' }}
            />
          </motion.div>

          {/* Tall image - spans 5 columns */}
          <motion.div
            className="col-span-12 md:col-span-5 overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <img
              src={render3Image}
              alt="3D Render - Bio Exhibition"
              className="w-full h-full object-cover"
              style={{ aspectRatio: '16 / 10' }}
            />
          </motion.div>

          {/* Full-width panoramic image */}
          <motion.div
            className="col-span-12 overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <img
              src={render2Image}
              alt="3D Render - Lounge & Community"
              className="w-full object-cover"
              style={{ aspectRatio: '21 / 9' }}
            />
          </motion.div>
        </div>
      </section>
    </ProjectDetailTemplate>
  );
}