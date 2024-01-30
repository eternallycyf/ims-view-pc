import { BaseOptions } from './BaseOptions';

/**
 * @public
 */
export type Accuracy = 'partially' | 'complimentary' | 'exactly';

/**
 * @public
 */
export type WildCards = 'disabled' | 'enabled' | 'withSpaces';

interface UniqueMarkerOptions {
  /**
   * Whether to search for matches across elements
   * @defaultValue `false`
   */
  acrossElements: boolean;
  /**
 *
 *  Either one of the following string values:
    - "partially": When searching for "lor" only "lor" inside "lorem" will be marked
    - "complementary": When searching for "lor" the whole word "lorem" will be marked
    - "exactly": When searching for "lor" only those exact words with a word boundary will be marked. In this example nothing inside "lorem". This value is equivalent to the previous option wordBoundary

    Or an object containing two properties:
    - "value": One of the above named string values
    - "limiters": A custom array of string limiters for accuracy "exactly" or "complementary". Read more about this in the tutorials section

    @defaultValue `"partially"`
 */
  accuracy: Accuracy;
  /**
   * Whether to search case sensitive
   * @defaultValue `false`
   */
  caseSensitive: boolean;
  /**
   * If [diacritic](https://en.wikipedia.org/wiki/Diacritic) characters should be matched. For example "piękny" would also match "piekny" and "doner" would also match "döner"
   * @defaultValue `true`
   */
  diacritics: boolean;
  /**
   * Whether to also find matches that contain soft hyphen, zero width space, zero width non-joiner and zero width joiner. They're used to indicate a point for a line break where there isn't enough space to show the full word
   * @defaultValue `false`
   */
  ignoreJoiners: boolean;
  /**
   * An array of punctuation mark strings. These punctuation marks can be between any characters, e.g. setting this option to ["'"] would match "Worlds", "World's" and "Wo'rlds". One or more apostrophes between the letters would still produce a match (e.g. "W'o''r'l'd's"). A typical setting for this option could be as follows: `":;.,-–—‒_(){}[]!'\"+=".split("")`
   * @defaultValue `[]`
   */
  ignorePunctuation: string[];
  /**
   * Whether to search for each word separated by a blank instead of the complete term
   * @defaultValue `true`
   */
  separateWordSearch: boolean;
  /**
   * An object with synonyms. The key will be a synonym for the value and the value for the key. Example: `"synonyms": {"one": "1"}` will add the synonym "1" for "one" and vice versa
   * @defaultValue `{}`
   */
  synonyms: Record<string, string>;
  /**
 * Set to any of the following string values:
  - "disabled": Disable wildcard usage
  - "enabled": When searching for "lor?m", the "?" will match zero or one non-space character (e.g. - "lorm", "loram", "lor3m", etc). When searching for "lor*m", the "*" will match zero or more non-space characters (e.g. "lorm", "loram", "lor123m", etc).
  - "withSpaces": When searching for "lor?m", the "?" will match zero or one space or non-space character (e.g. "lor m", "loram", etc). When searching for "lor*m", the "*" will match zero or more space or non-space characters (e.g. "lorm", "lore et dolor ipsum", "lor: m", etc).
  @defaultValue `"disabled"`
 */
  wildcards: WildCards;
}

/**
 * @public
 */
export type MarkOptions = Partial<BaseOptions> & Partial<UniqueMarkerOptions>;
