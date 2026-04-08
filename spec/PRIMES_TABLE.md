# USEL Tier 0 — Complete Semantic Primes Reference

**Version:** 1.0.0
**Count:** 65 primes
**Source:** Natural Semantic Metalanguage (Wierzbicka & Goddard, 2014; 2018 revision)
**Status:** FROZEN — changes require a new major version of the USEL spec

---

## How to Read This Table

| Column | Description |
|--------|-------------|
| **#** | Sequential ID (1–65) |
| **ID** | Unique identifier (`PRIME_<NAME>`) |
| **Name** | Canonical NSM prime name |
| **Category** | Semantic category |
| **Level** | Minimum access level (1 = child, 2 = teen, 3 = adult) |
| **Glyph** | Unicode symbol |
| **Color** | Hex color for the category |
| **Accepts** | Connection slot types this symbol receives |
| **Provides** | Connection slot types this symbol outputs |
| **EN / ES / ZH / AR** | Pronunciation in English, Spanish, Mandarin, Arabic |
| **Description** | One-sentence definition |

---

## Category Color Key

| Color | Category | Hex |
|-------|----------|-----|
| 🔴 | Substantive | `#E74C3C` |
| 🟠 | Relational | `#E67E22` |
| 🟡 | Determiner | `#F1C40F` |
| 🟢 | Quantifier | `#2ECC71` |
| 🩵 | Evaluator | `#1ABC9C` |
| 🔵 | Descriptor | `#3498DB` |
| 🟣 | Mental | `#9B59B6` |
| 🩷 | Speech | `#E91E63` |
| 🧡 | Action | `#FF5722` |
| 🤎 | Existence | `#795548` |
| 🩶 | Life | `#607D8B` |
| 🐳 | Time | `#00BCD4` |
| 💚 | Space | `#4CAF50` |
| 💙 | Logical | `#2196F3` |
| 🔶 | Intensifier | `#FF9800` |
| 💜 | Similarity | `#9C27B0` |

---

## 1. Substantives (6)

Substantive primes refer to entities — the actors, objects, and participants of any situation.

| # | ID | Name | Lvl | Glyph | Color | Accepts | Provides | EN | ES | ZH | AR | Description |
|---|-----|------|-----|-------|-------|---------|----------|----|----|----|----|-------------|
| 1 | `PRIME_I` | I | 1 | ◉ | `#E74C3C` | modifier | subject | I | yo | 我 (wǒ) | أنا (ʾanā) | The speaker; the self; first-person reference. |
| 2 | `PRIME_YOU` | YOU | 1 | ◎ | `#E74C3C` | modifier | subject | you | tú | 你 (nǐ) | أنتَ (ʾanta) | The addressee; second-person reference. |
| 3 | `PRIME_SOMEONE` | SOMEONE | 1 | ♟ | `#E74C3C` | modifier | subject, object | someone | alguien | 有人 (yǒurén) | شخص (šaḫṣ) | An unspecified person; any individual. |
| 4 | `PRIME_SOMETHING` | SOMETHING | 1 | ◆ | `#E74C3C` | modifier | subject, object | something | algo | 某事 (mǒushì) | شيء (šayʾ) | An unspecified thing; any entity that is not a person. |
| 5 | `PRIME_PEOPLE` | PEOPLE | 1 | ♜ | `#E74C3C` | modifier | subject, object | people | personas | 人们 (rénmen) | ناس (nās) | Multiple persons considered as a group. |
| 6 | `PRIME_BODY` | BODY | 1 | ⬡ | `#E74C3C` | modifier | subject, object | body | cuerpo | 身体 (shēntǐ) | جسم (jism) | The physical form of a living being. |

---

## 2. Relational Substantives (2)

Relational primes express part-whole and kind-of relationships between entities.

| # | ID | Name | Lvl | Glyph | Color | Accepts | Provides | EN | ES | ZH | AR | Description |
|---|-----|------|-----|-------|-------|---------|----------|----|----|----|----|-------------|
| 7 | `PRIME_KIND` | KIND | 2 | ⊛ | `#E67E22` | subject, object | modifier | kind | tipo | 种类 (zhǒnglèi) | نوع (nawʿ) | A category or type; what sort of thing something is. |
| 8 | `PRIME_PART` | PART | 2 | ⊞ | `#E67E22` | subject, object | modifier, object | part | parte | 部分 (bùfèn) | جزء (juzʾ) | A component or piece of a larger whole. |

---

## 3. Determiners (3)

Determiners specify which entity is being referred to.

| # | ID | Name | Lvl | Glyph | Color | Accepts | Provides | EN | ES | ZH | AR | Description |
|---|-----|------|-----|-------|-------|---------|----------|----|----|----|----|-------------|
| 9 | `PRIME_THIS` | THIS | 1 | ☞ | `#F1C40F` | subject, object | modifier | this | este | 这 (zhè) | هذا (hāḏā) | The entity being indicated; proximal demonstrative. |
| 10 | `PRIME_THE_SAME` | THE SAME | 2 | ≡ | `#F1C40F` | subject, object | modifier | the same | el mismo | 同样 (tóngyàng) | نفس (nafs) | Identity; the indicated entity and no other. |
| 11 | `PRIME_OTHER` | OTHER | 2 | ⊕ | `#F1C40F` | subject, object | modifier | other | otro | 别的 (biéde) | آخر (ʾāḫar) | A different entity from the one being discussed. |

---

## 4. Quantifiers (5)

Quantifiers express amount, number, and extent.

| # | ID | Name | Lvl | Glyph | Color | Accepts | Provides | EN | ES | ZH | AR | Description |
|---|-----|------|-----|-------|-------|---------|----------|----|----|----|----|-------------|
| 12 | `PRIME_ONE` | ONE | 1 | ① | `#2ECC71` | subject, object | modifier, value | one | uno | 一 (yī) | واحد (wāḥid) | The number one; a single instance. |
| 13 | `PRIME_TWO` | TWO | 1 | ② | `#2ECC71` | subject, object | modifier, value | two | dos | 二 (èr) | اثنان (iṯnān) | The number two; a pair. |
| 14 | `PRIME_SOME` | SOME | 1 | ◔ | `#2ECC71` | subject, object | modifier | some | algunos | 一些 (yīxiē) | بعض (baʿḍ) | An unspecified subset; not none and not all. |
| 15 | `PRIME_ALL` | ALL | 1 | ● | `#2ECC71` | subject, object | modifier | all | todos | 所有 (suǒyǒu) | كل (kull) | The totality; every member of a set. |
| 16 | `PRIME_MUCH_MANY` | MUCH/MANY | 2 | ⊚ | `#2ECC71` | subject, object | modifier | much/many | mucho | 很多 (hěnduō) | كثير (kaṯīr) | A large quantity or number. |

---

## 5. Evaluators (2)

Evaluators express fundamental value judgments.

| # | ID | Name | Lvl | Glyph | Color | Accepts | Provides | EN | ES | ZH | AR | Description |
|---|-----|------|-----|-------|-------|---------|----------|----|----|----|----|-------------|
| 17 | `PRIME_GOOD` | GOOD | 1 | ✦ | `#1ABC9C` | subject, object | modifier | good | bueno | 好 (hǎo) | جيد (jayyid) | Positive evaluation; desirable quality. |
| 18 | `PRIME_BAD` | BAD | 1 | ✘ | `#1ABC9C` | subject, object | modifier | bad | malo | 坏 (huài) | سيئ (sayyiʾ) | Negative evaluation; undesirable quality. |

---

## 6. Descriptors (2)

Descriptors express fundamental physical scale.

| # | ID | Name | Lvl | Glyph | Color | Accepts | Provides | EN | ES | ZH | AR | Description |
|---|-----|------|-----|-------|-------|---------|----------|----|----|----|----|-------------|
| 19 | `PRIME_BIG` | BIG | 1 | △ | `#3498DB` | subject, object | modifier | big | grande | 大 (dà) | كبير (kabīr) | Large in size, extent, or degree. |
| 20 | `PRIME_SMALL` | SMALL | 1 | ▽ | `#3498DB` | subject, object | modifier | small | pequeño | 小 (xiǎo) | صغير (ṣaġīr) | Small in size, extent, or degree. |

---

## 7. Mental Predicates (7)

Mental primes express cognitive and perceptual states.

| # | ID | Name | Lvl | Glyph | Color | Accepts | Provides | EN | ES | ZH | AR | Description |
|---|-----|------|-----|-------|-------|---------|----------|----|----|----|----|-------------|
| 21 | `PRIME_THINK` | THINK | 2 | ⊙ | `#9B59B6` | subject | predicate | think | pensar | 想 (xiǎng) | يفكر (yufakkir) | The cognitive act of reasoning or considering. |
| 22 | `PRIME_KNOW` | KNOW | 2 | ◈ | `#9B59B6` | subject | predicate | know | saber | 知道 (zhīdào) | يعرف (yaʿrif) | The state of having certain information or understanding. |
| 23 | `PRIME_WANT` | WANT | 1 | ↣ | `#9B59B6` | subject | predicate | want | querer | 要 (yào) | يريد (yurīd) | The mental state of desiring something to happen or to have. |
| 24 | `PRIME_NOT_WANT` | DON'T WANT | 1 | ↢ | `#9B59B6` | subject | predicate | don't want | no querer | 不要 (bùyào) | لا يريد (lā yurīd) | The mental state of not desiring; aversion. |
| 25 | `PRIME_FEEL` | FEEL | 1 | ♥ | `#9B59B6` | subject | predicate | feel | sentir | 感觉 (gǎnjué) | يشعر (yašʿur) | To experience an internal bodily or emotional state. |
| 26 | `PRIME_SEE` | SEE | 1 | ◉̂ | `#9B59B6` | subject | predicate | see | ver | 看 (kàn) | يرى (yarā) | To perceive visually. |
| 27 | `PRIME_HEAR` | HEAR | 1 | ◉̃ | `#9B59B6` | subject | predicate | hear | oír | 听 (tīng) | يسمع (yasmaʿ) | To perceive through sound. |

---

## 8. Speech (3)

Speech primes relate to linguistic communication.

| # | ID | Name | Lvl | Glyph | Color | Accepts | Provides | EN | ES | ZH | AR | Description |
|---|-----|------|-----|-------|-------|---------|----------|----|----|----|----|-------------|
| 28 | `PRIME_SAY` | SAY | 1 | 💬 | `#E91E63` | subject | predicate | say | decir | 说 (shuō) | يقول (yaqūl) | To produce words directed at someone. |
| 29 | `PRIME_WORDS` | WORDS | 2 | ✎ | `#E91E63` | modifier | subject, object | words | palabras | 话 (huà) | كلمات (kalimāt) | Linguistic units used in communication. |
| 30 | `PRIME_TRUE` | TRUE | 2 | ✓ | `#E91E63` | subject, object | modifier | true | verdad | 真 (zhēn) | صحيح (ṣaḥīḥ) | Corresponding to reality; not false. |

---

## 9. Actions, Events & Movement (3)

Action primes express doing, occurring, and physical displacement.

| # | ID | Name | Lvl | Glyph | Color | Accepts | Provides | EN | ES | ZH | AR | Description |
|---|-----|------|-----|-------|-------|---------|----------|----|----|----|----|-------------|
| 31 | `PRIME_DO` | DO | 1 | ⚡ | `#FF5722` | subject | predicate | do | hacer | 做 (zuò) | يفعل (yafʿal) | To perform an action; volitional activity. |
| 32 | `PRIME_HAPPEN` | HAPPEN | 2 | ⚙ | `#FF5722` | subject | predicate | happen | pasar | 发生 (fāshēng) | يحدث (yaḥduṯ) | For an event to occur; non-volitional occurrence. |
| 33 | `PRIME_MOVE` | MOVE | 1 | → | `#FF5722` | subject | predicate | move | mover | 动 (dòng) | يتحرك (yataḥarrak) | To change physical location or position. |

---

## 10. Existence, Possession & Specification (4)

Existence primes express being, having, and the presence of entities.

| # | ID | Name | Lvl | Glyph | Color | Accepts | Provides | EN | ES | ZH | AR | Description |
|---|-----|------|-----|-------|-------|---------|----------|----|----|----|----|-------------|
| 34 | `PRIME_THERE_IS` | THERE IS | 1 | ∃ | `#795548` | object | predicate | there is | hay | 有 (yǒu) | يوجد (yūjad) | Asserts the existence of something. |
| 35 | `PRIME_BE_SOMEONE` | BE (SOMEONE) | 2 | ≅ | `#795548` | subject, object | predicate | be (someone) | ser (alguien) | 是 (shì) | يكون (yakūn) | To have identity as a person. |
| 36 | `PRIME_BE_SOMETHING` | BE (SOMETHING) | 2 | ≈ | `#795548` | subject, object | predicate | be (something) | ser (algo) | 是 (shì) | يكون (yakūn) | To have identity as a thing; classification. |
| 37 | `PRIME_HAVE` | HAVE | 2 | ⊃ | `#795548` | subject | predicate | have | tener | 有 (yǒu) | يملك (yamlik) | Possession or association between an entity and something. |

---

## 11. Life & Death (2)

Life primes express the fundamental biological states.

| # | ID | Name | Lvl | Glyph | Color | Accepts | Provides | EN | ES | ZH | AR | Description |
|---|-----|------|-----|-------|-------|---------|----------|----|----|----|----|-------------|
| 38 | `PRIME_LIVE` | LIVE | 2 | ❋ | `#607D8B` | subject | predicate | live | vivir | 活 (huó) | يعيش (yaʿīš) | To be alive; to exist as a living being. |
| 39 | `PRIME_DIE` | DIE | 2 | ✝ | `#607D8B` | subject | predicate | die | morir | 死 (sǐ) | يموت (yamūt) | To cease living; the end of biological life. |

---

## 12. Time (8)

Temporal primes express when things happen and the structure of time.

| # | ID | Name | Lvl | Glyph | Color | Accepts | Provides | EN | ES | ZH | AR | Description |
|---|-----|------|-----|-------|-------|---------|----------|----|----|----|----|-------------|
| 40 | `PRIME_WHEN_TIME` | WHEN/TIME | 2 | ⏳ | `#00BCD4` | subject, object | modifier, condition | when/time | cuándo/tiempo | 时候 (shíhou) | متى/وقت (matā/waqt) | Reference to a temporal point or interval. |
| 41 | `PRIME_NOW` | NOW | 1 | ⊛̇ | `#00BCD4` | — | modifier | now | ahora | 现在 (xiànzài) | الآن (al-ʾān) | The present moment; the current time. |
| 42 | `PRIME_BEFORE` | BEFORE | 1 | ◁ | `#00BCD4` | subject, object | modifier | before | antes | 之前 (zhīqián) | قبل (qabl) | Earlier in time than a reference point. |
| 43 | `PRIME_AFTER` | AFTER | 1 | ▷ | `#00BCD4` | subject, object | modifier | after | después | 之后 (zhīhòu) | بعد (baʿd) | Later in time than a reference point. |
| 44 | `PRIME_A_LONG_TIME` | A LONG TIME | 2 | ⊳⊳ | `#00BCD4` | — | modifier | a long time | mucho tiempo | 很久 (hěnjiǔ) | وقت طويل (waqt ṭawīl) | An extended duration. |
| 45 | `PRIME_A_SHORT_TIME` | A SHORT TIME | 2 | ⊲ | `#00BCD4` | — | modifier | a short time | poco tiempo | 短时间 (duǎn shíjiān) | وقت قصير (waqt qaṣīr) | A brief duration. |
| 46 | `PRIME_FOR_SOME_TIME` | FOR SOME TIME | 2 | ⊳ | `#00BCD4` | — | modifier | for some time | por un tiempo | 一段时间 (yīduàn shíjiān) | لبعض الوقت (libaʿḍ al-waqt) | An unspecified but bounded duration. |
| 47 | `PRIME_MOMENT` | MOMENT | 2 | ⊡ | `#00BCD4` | — | modifier | moment | momento | 一刻 (yīkè) | لحظة (laḥẓa) | An instantaneous or very brief point in time. |

---

## 13. Space (9)

Spatial primes express location, proximity, and physical relationships.

| # | ID | Name | Lvl | Glyph | Color | Accepts | Provides | EN | ES | ZH | AR | Description |
|---|-----|------|-----|-------|-------|---------|----------|----|----|----|----|-------------|
| 48 | `PRIME_WHERE_PLACE` | WHERE/PLACE | 2 | ⊠ | `#4CAF50` | subject, object | modifier, condition | where/place | dónde/lugar | 哪里/地方 (nǎlǐ/dìfāng) | أين/مكان (ʾayn/makān) | Reference to a spatial location. |
| 49 | `PRIME_HERE` | HERE | 1 | ⊙̂ | `#4CAF50` | — | modifier | here | aquí | 这里 (zhèlǐ) | هنا (hunā) | The location of the speaker; proximal place. |
| 50 | `PRIME_ABOVE` | ABOVE | 1 | ⬆ | `#4CAF50` | subject, object | modifier | above | arriba | 上面 (shàngmiàn) | فوق (fawq) | Higher in vertical position relative to a reference. |
| 51 | `PRIME_BELOW` | BELOW | 1 | ⬇ | `#4CAF50` | subject, object | modifier | below | abajo | 下面 (xiàmiàn) | تحت (taḥt) | Lower in vertical position relative to a reference. |
| 52 | `PRIME_FAR` | FAR | 2 | ↔ | `#4CAF50` | subject, object | modifier | far | lejos | 远 (yuǎn) | بعيد (baʿīd) | At a great distance from a reference point. |
| 53 | `PRIME_NEAR` | NEAR | 2 | ⊷ | `#4CAF50` | subject, object | modifier | near | cerca | 近 (jìn) | قريب (qarīb) | At a small distance from a reference point. |
| 54 | `PRIME_SIDE` | SIDE | 2 | ⊟ | `#4CAF50` | subject, object | modifier | side | lado | 旁边 (pángbiān) | جانب (jānib) | A lateral position relative to a reference. |
| 55 | `PRIME_INSIDE` | INSIDE | 1 | ⊡ | `#4CAF50` | subject, object | modifier | inside | dentro | 里面 (lǐmiàn) | داخل (dāḫil) | Enclosed within the boundaries of something. |
| 56 | `PRIME_TOUCH` | TOUCH | 2 | ⊘ | `#4CAF50` | subject | predicate | touch | tocar | 触 (chù) | يلمس (yalmas) | Physical contact between two entities. |

---

## 14. Logical Concepts (5)

Logical primes express negation, possibility, causation, and conditionality.

| # | ID | Name | Lvl | Glyph | Color | Accepts | Provides | EN | ES | ZH | AR | Description |
|---|-----|------|-----|-------|-------|---------|----------|----|----|----|----|-------------|
| 57 | `PRIME_NOT` | NOT | 1 | ¬ | `#2196F3` | predicate, modifier | modifier | not | no | 不 (bù) | لا (lā) | Negation; the absence or opposite of what follows. |
| 58 | `PRIME_MAYBE` | MAYBE | 2 | ◇ | `#2196F3` | predicate | modifier | maybe | quizás | 也许 (yěxǔ) | ربما (rubbamā) | Epistemic possibility; uncertain truth. |
| 59 | `PRIME_CAN` | CAN | 2 | ◈̄ | `#2196F3` | subject | modifier | can | poder | 能 (néng) | يستطيع (yastaṭīʿ) | Ability or possibility of doing something. |
| 60 | `PRIME_BECAUSE` | BECAUSE | 2 | ∵ | `#2196F3` | predicate | condition | because | porque | 因为 (yīnwèi) | لأن (liʾanna) | Causal relation; the reason for something. |
| 61 | `PRIME_IF` | IF | 2 | ⟐ | `#2196F3` | predicate | condition | if | si | 如果 (rúguǒ) | إذا (ʾiḏā) | Conditional relation; contingent on a condition. |

---

## 15. Intensifier & Augmentor (2)

Intensifiers modify the degree of other primes.

| # | ID | Name | Lvl | Glyph | Color | Accepts | Provides | EN | ES | ZH | AR | Description |
|---|-----|------|-----|-------|-------|---------|----------|----|----|----|----|-------------|
| 62 | `PRIME_VERY` | VERY | 2 | ⊕⊕ | `#FF9800` | modifier | modifier | very | muy | 很 (hěn) | جداً (jiddan) | High degree; intensifies the modified concept. |
| 63 | `PRIME_MORE` | MORE | 2 | ⊕ | `#FF9800` | modifier, object | modifier | more | más | 更 (gèng) | أكثر (ʾakṯar) | Greater degree or quantity in comparison. |

---

## 16. Similarity (2)

Similarity primes express comparison and manner.

| # | ID | Name | Lvl | Glyph | Color | Accepts | Provides | EN | ES | ZH | AR | Description |
|---|-----|------|-----|-------|-------|---------|----------|----|----|----|----|-------------|
| 64 | `PRIME_LIKE` | LIKE/AS | 2 | ≈̃ | `#9C27B0` | subject, object | modifier | like/as | como | 像 (xiàng) | مثل (miṯl) | Similarity comparison; in the manner of. |
| 65 | `PRIME_WAY` | WAY | 3 | ⤳ | `#9C27B0` | subject, object | modifier | way | manera | 方式 (fāngshì) | طريقة (ṭarīqa) | A manner or method of doing something. |

---

## Summary Statistics

| Statistic | Value |
|-----------|-------|
| **Total Primes** | 65 |
| **Categories** | 16 |
| **Level 1 (Child)** | 30 |
| **Level 2 (Teen)** | 33 |
| **Level 3 (Adult)** | 2 |
| **Languages** | 4 (EN, ES, ZH, AR) |
| **Unique Glyphs** | 65 |

### Distribution by Level

```
Level 1 ██████████████████████████████ 30 (46%)
Level 2 █████████████████████████████████ 33 (51%)
Level 3 ██ 2 (3%)
```

### Distribution by Category

```
Space         █████████ 9
Time          ████████ 8
Mental        ███████ 7
Substantive   ██████ 6
Quantifier    █████ 5
Logical       █████ 5
Existence     ████ 4
Action        ███ 3
Determiner    ███ 3
Speech        ███ 3
Evaluator     ██ 2
Descriptor    ██ 2
Relational    ██ 2
Life          ██ 2
Intensifier   ██ 2
Similarity    ██ 2
```

---

## NSM Source References

The 65 primes are drawn from the following key publications:

1. **Wierzbicka, A.** (1972). *Semantic Primitives*. Frankfurt: Athenäum.
   — Original identification of semantic primitives.

2. **Wierzbicka, A.** (1996). *Semantics: Primes and Universals*. Oxford University Press.
   — Comprehensive theory of Natural Semantic Metalanguage.

3. **Goddard, C. & Wierzbicka, A.** (2002). *Meaning and Universal Grammar*. John Benjamins.
   — Cross-linguistic validation across 16 languages.

4. **Goddard, C. & Wierzbicka, A.** (2014). *Words and Meanings*. Oxford University Press.
   — Lexical semantics using NSM primes.

5. **Goddard, C.** (2018). *Ten Lectures on Natural Semantic Metalanguage*. Brill.
   — Modern formulation with the current 65-prime inventory.

6. **NSM Homepage:** https://nsm-approach.net/
   — Official repository of NSM research and prime lists.

---

## Notes on Universality

The claim that these 65 concepts are "universal" means:

- Each prime has been identified as a **distinct lexical unit** (word or fixed expression) in every language studied under the NSM framework
- The set has been tested across **30+ typologically diverse languages** including Indo-European, Sino-Tibetan, Austronesian, Niger-Congo, Uralic, Dravidian, and others
- Primes are **semantically irreducible** — they cannot be defined without circularity using simpler terms
- The set has been **remarkably stable** since the late 1990s, with only minor additions

This does NOT mean every language expresses these concepts identically. Surface forms vary dramatically — what is universal is the **semantic molecule**, not the phonological form.

---

<div align="center">

**USEL Tier 0 Primes Reference v1.0.0**
*65 atoms of human meaning*

Copyright © 2026 Kit & Ada Marie · MIT License

</div>
