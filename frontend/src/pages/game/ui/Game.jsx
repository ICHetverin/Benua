import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePersons } from "entities/person";
import styles from "./Game.module.css";

import alexanderImage from "shared/assets/images/benua-game/alexander-nikolaevich.jpg";
import albertImage from "shared/assets/images/benua-game/albert-nikolaevich.jpg";
import mariaImage from "shared/assets/images/benua-game/maria-kuznetsova.jpg";
import yuliyImage from "shared/assets/images/benua-game/yuliy-yulievich.jpg";
import leontyImage from "shared/assets/images/benua-game/leonty-nikolaevich.jpeg";
import nikolayLeontievichImage from "shared/assets/images/benua-game/nikolay-leontievich.jpg";
import nikolayNikolaevichImage from "shared/assets/images/benua-game/nikolay-nikolaevich.jpg";
import mikhailImage from "shared/assets/images/benua-game/mikhail-nikolaevich.jpg";
import nikolayAlbertovichImage from "shared/assets/images/benua-game/nikolay-albertovich.png";

const people = {
  alexander: {
    name: "Александр Николаевич Бенуа",
    role: "историк искусства, театральный художник, «Мир искусства»",
    years: "1870-1960",
    image: alexanderImage,
    siteCardNames: ["Александр Николаевич Бенуа"],
    cardUrl: "https://drive.google.com/drive/folders/11C_JYggqqD-9KoHczo5Tq-JPS0bqtOuw?usp=share_link",
    description: [
      "Русский живописец, график, сценограф, иллюстратор, историк искусства, художественный критик и музеевед. Один из создателей и идеолог объединения «Мир искусства», вдохновитель и активный участник «Русских сезонов» в Париже.",
      "Известен циклами акварелей о Версале, архитектурными пейзажами Петергофа, Царского Села и Павловска, эскизами декораций и костюмов к балетам, а также иллюстрациями к произведениям А.С. Пушкина.",
      "После революции участвовал в спасении памятников культуры, входил в Совет Эрмитажа и в 1918 году возглавил Картинную галерею Эрмитажа. В 1926 году эмигрировал, работал во Франции и Италии.",
    ],
  },
  albert: {
    name: "Альберт Николаевич Бенуа",
    role: "пейзажист-акварелист, академик Императорской Академии художеств",
    years: "1852-1936",
    image: albertImage,
    siteCardNames: ["Альберт Николаевич Бенуа"],
    cardUrl: "https://drive.google.com/drive/folders/15VwYSz3PYdJ_Xp9JJbDoRShgSQ_rKFCT?usp=share_link",
    description: [
      "Талантливый русский художник-акварелист и архитектор, яркий представитель творческой династии Бенуа. По воспоминаниям Александра Бенуа, Альберт был одаренным импровизатором с оптимистичной натурой.",
      "Он известен как мастер акварельного пейзажа, один из основателей и лидер Общества русских акварелистов. Его работы ценили за свободу, простоту и красоту.",
      "После революции заведовал Музеем прикладного искусства, участвовал в создании «Дома искусств», затем эмигрировал во Францию. В 1926 году был принят в Парижскую Академию художеств.",
    ],
  },
  maria: {
    name: "Мария Николаевна Кузнецова-Бенуа",
    role: "оперная певица",
    years: "1880-1966",
    image: mariaImage,
    siteCardNames: ["Мария Николаевна Кузнецова-Бенуа"],
    cardUrl: "https://drive.google.com/drive/folders/1ejaOv7Pae4L8QgJqMgB3YpqZpy70P2VZ?usp=share_link",
    description: [
      "Русская оперная певица, лирико-колоратурное сопрано, дочь портретиста Н.Д. Кузнецова. После переезда в Петербург начала учиться пению и в 1905 году стала солисткой Мариинского театра.",
      "Ее карьера была связана с крупными сценами Европы. Она исполнила более 25 ведущих партий, включая Татьяну, Кармен, Снегурочку, Чио-Чио-сан и партии в операх Вагнера, Массне и Глюка.",
      "После 1918 года гастролировала по Европе, открыла в Париже собственный театр и участвовала в создании труппы «Русская опера в Париже».",
    ],
  },
  yuliy: {
    name: "Юлий Юльевич Бенуа",
    role: "русский архитектор из семьи Бенуа",
    years: "1852-1929",
    image: yuliyImage,
    siteCardNames: ["Юлий Юльевич Бенуа"],
    cardUrl: "https://drive.google.com/drive/folders/1ASQs8AXKqAtYoWPi8cvsTBt_8Xlx2YFl?usp=share_link",
    description: [
      "Русский архитектор, академик архитектуры и представитель знаменитой династии. Учился в гимназии Карла Мая и на архитектурном отделении Императорской Академии художеств.",
      "Автор около 30 зданий в Санкт-Петербурге. Среди важных работ - Лиговский народный дом графини Паниной и участие в комплексе зданий Первого Российского страхового общества.",
      "После революции работал в Министерстве продовольствия РСФСР, занимался сельским хозяйством и агропромышленным строительством, владел Лесной фермой.",
    ],
  },
  leonty: {
    name: "Леонтий Николаевич Бенуа",
    role: "архитектор, академик и профессор Императорской Академии художеств",
    years: "1856-1928",
    image: leontyImage,
    siteCardNames: ["Леонтий Николаевич Бенуа", "Леон Николаевич Бенуа"],
    cardUrl: "https://drive.google.com/drive/folders/1oa38hYaofjgufLEUNfRTVVRd2xoLt2cB?usp=sharing",
    description: [
      "Выдающийся русский архитектор, педагог и общественный деятель, второй сын Николая Леонтьевича Бенуа. Окончил Императорскую Академию художеств с золотой медалью, позднее стал профессором и ректором Академии.",
      "Автор более 60 построек в Санкт-Петербурге, Москве, Киеве и за рубежом, среди них Придворная певческая капелла, Великокняжеская усыпальница и комплекс «Печатный двор».",
      "Ученики уважали его как внимательного руководителя. После революции был арестован по делу Таганцева, освобожден в 1922 году и последние годы жил в Детском Селе.",
    ],
  },
  nikolayLeontievich: {
    name: "Николай Леонтьевич Бенуа",
    role: "архитектор, главный зодчий Петергофа",
    years: "1813-1898",
    image: nikolayLeontievichImage,
    siteCardNames: ["Николай Леонтьевич Бенуа"],
    cardUrl: "https://docs.google.com/document/d/1kAoIzrL7166rBAmnd6n5s3MuFJr6eByi/edit?usp=sharing&ouid=101939425111691666209&rtpof=true&sd=true",
    description: [
      "Выдающийся русский архитектор и основатель знаменитой творческой династии в России. Был зачислен в Академию художеств в 14 лет и окончил ее с большой золотой медалью.",
      "Известен как главный архитектор Петергофа и главный архитектор императорских театров. Среди его работ - дворцовые конюшни, вокзал станции «Новый Петергоф» и постройки Петергофского ансамбля.",
      "Во время пенсионерской поездки изучал Орвиетский собор в Италии, обмеряя его детали. Скончался в Петербурге, успев увидеть расцвет талантов своих детей.",
    ],
  },
  nikolayNikolaevich: {
    name: "Николай Николаевич Бенуа",
    role: "офицер, командир 12-го гусарского Ахтырского полка",
    years: "1858-1915",
    image: nikolayNikolaevichImage,
    siteCardNames: ["Николай Николаевич Бенуа"],
    cardUrl: "https://share.google/owMfbYbnqdnWuqlXt",
    description: [
      "Представитель династии, избравший путь военного. Он был сыном архитектора Николая Леонтьевича Бенуа и родным братом художников Альберта, Леонтия и Александра Бенуа.",
      "После Николаевского кавалерийского училища служил в Лейб-гвардии Уланском полку, а вершиной карьеры стало командование прославленным 12-м гусарским Ахтырским полком.",
      "С началом Первой мировой войны вернулся в строй и был назначен начальником 52-й бригады Государственного ополчения. Скончался от болезни в 1915 году.",
    ],
  },
  mikhail: {
    name: "Михаил Николаевич Бенуа",
    role: "морской офицер",
    years: "1862-1930",
    image: mikhailImage,
    siteCardNames: ["Михаил Николаевич Бенуа"],
    cardUrl: "https://docs.google.com/document/d/1iwTbQMDKn3WeThtwNeMDDSvTQk8MWWH5pELcS8J9q58/edit?usp=sharing",
    description: [
      "Морской офицер, участник кругосветного плавания, впоследствии предприниматель и директор правления пароходного общества «Кавказ и Меркурий».",
      "После Морского училища был назначен на клипер «Пластун», который отправлялся в дальнее плавание. За три года он посетил Сингапур, Шанхай, Гонконг, Нагасаки, Гонолулу, Таити, Сан-Франциско, Мельбурн и Сидней.",
      "После революции потерял прежнее положение, был арестован вместе с братом Леонтием в 1921 году. Скончался в Петербурге в 1930 году.",
    ],
  },
  nikolayAlbertovich: {
    name: "Николай Альбертович Бенуа",
    role: "капитан, основатель звуковой разведки",
    years: "1881-1938",
    image: nikolayAlbertovichImage,
    siteCardNames: ["Николай Альбертович Бенуа"],
    cardUrl: "https://docs.google.com/document/d/1Au0qJoWf-jmXiPjhCsl4W0Rd9cK7nMd4/edit?usp=sharing&ouid=101939425111691666209&rtpof=true&sd=true",
    description: [
      "Российский офицер, изобретатель и основатель звуковой разведки. Он был сыном художника-акварелиста Альберта Николаевича Бенуа и внуком архитектора Николая Леонтьевича Бенуа.",
      "В 1913 году разработал звукометрический прибор для определения местоположения артиллерийских батарей по звуку выстрелов, а в 1914 году провел успешные испытания на фронте Первой мировой войны.",
      "После революции работал старшим инженером лаборатории точной механики. В 1935 году был сослан в Казахстан, в 1938 году повторно арестован и расстрелян. В 1956 году семья была реабилитирована.",
    ],
  },
};

const introQuestion = {
  text: "Какой досуг вы бы выбрали?",
  options: [
    {
      text: "Поход в изобразительный музей или на концерт классической музыки.",
      branch: "art",
    },
    {
      text: "Экскурсия по городу с разбором архитектурных стилей или мастер-класс по 3D-моделированию.",
      branch: "architecture",
    },
    {
      text: "Поход в артиллерийский музей, на подлодку или страйкбол.",
      branch: "military",
    },
  ],
};

const heroPortraitKeys = ["alexander", "albert", "maria", "mikhail", "leonty"];

const branches = {
  art: {
    title: "Искусство",
    accent: "Музеи, сцена и творческая свобода",
    people: ["alexander", "albert", "maria"],
    questions: [
      {
        text: "Что вам было бы ближе в искусстве?",
        options: [
          ["Изучать искусство прошлого, музеи, историю живописи", "alexander"],
          ["Рисовать свободно, работать на пленэре", "albert"],
          ["Посещать концерты классической музыки или оперу", "maria"],
        ],
      },
      {
        text: "Ваше отношение к театру:",
        options: [
          ["Анализ постановок и оформление спектаклей", "alexander"],
          ["Вдохновение, увлечение музыкой", "albert"],
          ["Театр - моя жизнь, разучиваю арии, пою дома", "maria"],
        ],
      },
      {
        text: "Какой вид искусства для вас наиболее привлекателен?",
        options: [
          ["Книжная графика и театральные декорации", "alexander"],
          ["Акварельные пейзажи", "albert"],
          ["Классическая опера", "maria"],
        ],
      },
      {
        text: "Что для вас важнее?",
        options: [
          ["Историческая точность эпохи", "alexander"],
          ["Свобода творчества", "albert"],
          ["Гармония семьи и искусства", "maria"],
        ],
      },
      {
        text: "Где вы чувствуете себя лучше?",
        options: [
          ["В музеях и библиотеках", "alexander"],
          ["В путешествиях и на природе", "albert"],
          ["В театре", "maria"],
        ],
      },
      {
        text: "Ваш стиль мышления:",
        options: [
          ["Аналитический", "alexander"],
          ["Идеалистический", "albert"],
          ["Прагматический", "maria"],
        ],
      },
      {
        text: "Искусство для вас - это:",
        options: [
          ["История и культура", "alexander"],
          ["Свобода и вдохновение", "albert"],
          ["Слава и блеск софитов", "maria"],
        ],
      },
    ],
  },
  architecture: {
    title: "Архитектура",
    accent: "Город, форма и наследие",
    people: ["yuliy", "leonty", "nikolayLeontievich"],
    questions: [
      {
        text: "Что вам ближе в архитектуре?",
        options: [
          ["Крупные городские здания и общественные пространства", "yuliy"],
          ["Эстетическая архитектура и сочетание исторических форм с современными", "leonty"],
          ["Готические формы и строгие пропорции", "nikolayLeontievich"],
        ],
      },
      {
        text: "Ваш подход к работе:",
        options: [
          ["Работа с масштабными проектами", "yuliy"],
          ["Сочетание классики и современных технологий", "leonty"],
          ["Скрупулезная работа с деталями", "nikolayLeontievich"],
        ],
      },
      {
        text: "На что обращаете внимание, когда смотрите на здание?",
        options: [
          ["Функциональность", "yuliy"],
          ["Красота", "leonty"],
          ["Традиция и история", "nikolayLeontievich"],
        ],
      },
      {
        text: "Какие проекты вам ближе?",
        options: [
          ["Промышленная архитектура и доходные дома", "yuliy"],
          ["Особняки и художественные интерьеры", "leonty"],
          ["Ансамбли из нескольких построек, окруженные парками", "nikolayLeontievich"],
        ],
      },
      {
        text: "В работе вы:",
        options: [
          ["Практик", "yuliy"],
          ["Художник-архитектор", "leonty"],
          ["Академист", "nikolayLeontievich"],
        ],
      },
      {
        text: "Что для вас важнее в архитектуре?",
        options: [
          ["Социальная польза", "yuliy"],
          ["Эстетика", "leonty"],
          ["Традиция, классика", "nikolayLeontievich"],
        ],
      },
      {
        text: "Отношение к наследию:",
        options: [
          ["Развитие и использование", "yuliy"],
          ["Современное звучание с сохранением формы", "leonty"],
          ["Сохранение без изменений", "nikolayLeontievich"],
        ],
      },
    ],
  },
  military: {
    title: "Военное дело",
    accent: "Дисциплина, риск и стратегия",
    people: ["nikolayNikolaevich", "mikhail", "nikolayAlbertovich"],
    questions: [
      {
        text: "Что для вас важно в работе?",
        options: [
          ["Дисциплина и порядок", "nikolayNikolaevich"],
          ["Ответственность и выполнение обязательств", "mikhail"],
          ["Решение проблемы, даже если будет конфликт", "nikolayAlbertovich"],
        ],
      },
      {
        text: "Ваш характер:",
        options: [
          ["Решительный", "nikolayNikolaevich"],
          ["Спокойный и исполнительный", "mikhail"],
          ["Аналитический", "nikolayAlbertovich"],
        ],
      },
      {
        text: "В опасной ситуации вы:",
        options: [
          ["Действуете сразу", "nikolayNikolaevich"],
          ["Следуете приказу", "mikhail"],
          ["Просчитываете последствия", "nikolayAlbertovich"],
        ],
      },
      {
        text: "В команде вы:",
        options: [
          ["Командир", "nikolayNikolaevich"],
          ["Исполнитель", "mikhail"],
          ["Стратег", "nikolayAlbertovich"],
        ],
      },
      {
        text: "Выбирая военную профессию в конце XIX в. вы бы выбрали:",
        options: [
          ["Кавалерию", "nikolayNikolaevich"],
          ["Годы плавания", "mikhail"],
          ["Артиллерию", "nikolayAlbertovich"],
        ],
      },
      {
        text: "Главное в военном деле:",
        options: [
          ["Победа", "nikolayNikolaevich"],
          ["Порядок", "mikhail"],
          ["Точность", "nikolayAlbertovich"],
        ],
      },
      {
        text: "Отношение к риску:",
        options: [
          ["Готов рисковать", "nikolayNikolaevich"],
          ["Осторожен", "mikhail"],
          ["Точно просчитанный риск", "nikolayAlbertovich"],
        ],
      },
    ],
  },
};

const getInitialScores = (branch) =>
  branches[branch].people.reduce((scores, personKey) => {
    scores[personKey] = 0;
    return scores;
  }, {});

const getSitePersonPath = (person, sitePersons) => {
  if (!person.siteCardNames?.length) {
    return null;
  }

  const normalizedNames = person.siteCardNames.map((name) => name.toLowerCase());
  const sitePerson = sitePersons.find((item) =>
    normalizedNames.includes(item.name?.toLowerCase())
  );

  return sitePerson?._id ? `/persons/${sitePerson._id}` : null;
};

export function Game() {
  const navigate = useNavigate();
  const { data: sitePersons = [] } = usePersons();
  const [branch, setBranch] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [resultKey, setResultKey] = useState(null);

  const currentBranch = branch ? branches[branch] : null;
  const currentQuestion = currentBranch?.questions[questionIndex];
  const result = resultKey ? people[resultKey] : null;
  const resultSitePath = result ? getSitePersonPath(result, sitePersons) : null;

  const progress = useMemo(() => {
    if (!currentBranch) {
      return 0;
    }

    return Math.round((questionIndex / currentBranch.questions.length) * 100);
  }, [currentBranch, questionIndex]);

  const startBranch = (nextBranch) => {
    setBranch(nextBranch);
    setQuestionIndex(0);
    setAnswers([]);
    setResultKey(null);
  };

  const answerQuestion = (personKey) => {
    const nextAnswers = [...answers.slice(0, questionIndex), personKey];

    if (questionIndex === currentBranch.questions.length - 1) {
      const nextScores = getInitialScores(branch);

      nextAnswers.forEach((key) => {
        nextScores[key] += 1;
      });

      const winner = currentBranch.people.reduce((bestKey, key) => {
        if (nextScores[key] > nextScores[bestKey]) {
          return key;
        }

        return bestKey;
      }, currentBranch.people[0]);

      setAnswers(nextAnswers);
      setResultKey(winner);
      return;
    }

    setAnswers(nextAnswers);
    setQuestionIndex((index) => index + 1);
  };

  const resetGame = () => {
    setBranch(null);
    setQuestionIndex(0);
    setAnswers([]);
    setResultKey(null);
  };

  const goBack = () => {
    if (!branch || questionIndex === 0) {
      resetGame();
      return;
    }

    setQuestionIndex((index) => index - 1);
  };

  const openCard = (sitePath) => {
    if (sitePath) {
      navigate(sitePath);
      return;
    }

    navigate("/persons");
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>Интерактивная игра</span>
          <h1 className={styles.title}>Кем из семьи Бенуа вы могли бы быть?</h1>
          <p className={styles.lead}>
            Династия Бенуа подарила России художников, архитекторов и военных.
            Театральные декорации, дворцы Петербурга, офицерская честь - за
            каждым из этих дел стоял свой представитель знаменитой семьи.
          </p>
          <p className={styles.lead}>
            А нашли бы вы свое место в этой династии? Сыграйте и проверьте,
            чей характер вам ближе всего.
          </p>
        </div>

        <div className={styles.portraitStrip} aria-hidden="true">
          {heroPortraitKeys.map((key) => (
            <img key={key} src={people[key].image} alt="" className={styles.stripImage} />
          ))}
        </div>
      </section>

      <section className={styles.gamePanel}>
        {!branch && (
          <>
            <div className={styles.panelHeader}>
              <span className={styles.step}>Вопрос 1</span>
              <h2 className={styles.question}>{introQuestion.text}</h2>
            </div>
            <div className={styles.optionsGrid}>
              {introQuestion.options.map((option) => (
                <button
                  className={styles.optionButton}
                  key={option.branch}
                  type="button"
                  onClick={() => startBranch(option.branch)}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </>
        )}

        {branch && !result && (
          <>
            <div className={styles.panelHeader}>
              <span className={styles.step}>
                {currentBranch.title} · вопрос {questionIndex + 2} из 8
              </span>
              <h2 className={styles.question}>{currentQuestion.text}</h2>
              <p className={styles.branchAccent}>{currentBranch.accent}</p>
              <div className={styles.progressTrack} aria-hidden="true">
                <span className={styles.progressBar} style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className={styles.optionsGrid}>
              {currentQuestion.options.map(([text, personKey]) => (
                <button
                  className={styles.optionButton}
                  key={text}
                  type="button"
                  onClick={() => answerQuestion(personKey)}
                >
                  {text}
                </button>
              ))}
            </div>

            <button className={styles.secondaryButton} type="button" onClick={goBack}>
              Назад
            </button>
          </>
        )}

        {result && (
          <div className={styles.result}>
            <div className={styles.resultImageWrap}>
              <img src={result.image} alt={result.name} className={styles.resultImage} />
            </div>
            <div className={styles.resultContent}>
              <span className={styles.step}>Ваш результат</span>
              <h2 className={styles.resultTitle}>
                Ура, по вашим ответам вам наиболее близок {result.name}!
              </h2>
              <p className={styles.resultMeta}>
                {result.years} · {result.role}
              </p>
              {result.description.map((paragraph) => (
                <p className={styles.resultText} key={paragraph}>
                  {paragraph}
                </p>
              ))}
              <div className={styles.actions}>
                <button
                  className={styles.primaryLink}
                  type="button"
                  onClick={() => openCard(resultSitePath)}
                >
                  Открыть карточку
                </button>
                <button className={styles.secondaryButton} type="button" onClick={resetGame}>
                  Пройти еще раз
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

    </main>
  );
}
