import { Body as ApolloBody } from 'apollo-angular/http/types.d';
import {isPlainObject} from "@apollo/client/utilities";

export const UtilsGraphql = {
  isExtractable(value: File | Blob): boolean {
    return (
      (typeof File !== 'undefined' && value instanceof File) || (typeof Blob !== 'undefined' && value instanceof Blob)
    );
  },

  /* eslint-disable @typescript-eslint/no-explicit-any */
  /**
   * Recursively extracts files and their {@link ObjectPath object paths} within a
   * value, replacing them with `null` in a deep clone without mutating the
   * original value.
   * [`FileList`](https://developer.mozilla.org/en-US/docs/Web/API/Filelist)
   * instances are treated as
   * [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) instance
   * arrays.
   * @template Extractable Extractable file type.
   * @param {unknown} value Value to extract files from. Typically an object tree.
   * @param {(value: unknown) => value is Extractable} isExtractable Matches
   *   extractable files. Typically {@linkcode isExtractableFile}.
   * @param {ObjectPath} [path] Prefix for object paths for extracted files.
   *   Defaults to `""`.
   * @returns {Extraction<Extractable>} Extraction result.
   * @example
   * Extracting files from an object.
   *
   * For the following:
   *
   * ```js
   * import extractFiles from "extract-files/extractFiles.mjs";
   * import isExtractableFile from "extract-files/isExtractableFile.mjs";
   *
   * const file1 = new File(["1"], "1.txt", { type: "text/plain" });
   * const file2 = new File(["2"], "2.txt", { type: "text/plain" });
   * const value = {
   *   a: file1,
   *   b: [file1, file2],
   * };
   *
   * const { clone, files } = extractFiles(value, isExtractableFile, "prefix");
   * ```
   *
   * `value` remains the same.
   *
   * `clone` is:
   *
   * ```json
   * {
   *   "a": null,
   *   "b": [null, null]
   * }
   * ```
   *
   * `files` is a
   * [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
   * instance containing:
   *
   * | Key     | Value                        |
   * | :------ | :--------------------------- |
   * | `file1` | `["prefix.a", "prefix.b.0"]` |
   * | `file2` | `["prefix.b.1"]`             |
   */
  extractFiles(body: ApolloBody | ApolloBody[]): { clone: ApolloBody; files: Map<any, any> } {
    const clones = new Map();
    const files = new Map();
    const realpath = '';

    const recurse = (value: any, path: string, recursed: Set<any>) => {
      if (UtilsGraphql.isExtractable(value)) {
        const filePaths: string[] = files.get(value);

        if (filePaths) {
          filePaths.push(path);
        } else {
          files.set(value, [path]);
        }

        // eslint-disable-next-line unicorn/no-null
        return null;
      }

      const valueIsList = Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
      const valueIsPlainObject = isPlainObject(value);

      if (valueIsList || valueIsPlainObject) {
        let clone = clones.get(value);

        const uncloned = !clone;

        if (uncloned) {
          // eslint-disable-next-line prettier/prettier, unicorn/no-nested-ternary
          clone = valueIsList ? [] : value instanceof Object ? {} : Object.create(null);
          clones.set(value, clone);
        }

        if (!recursed.has(value)) {
          const pathPrefix = path ? `${path}.` : '';
          const recursedDeeper = new Set(recursed).add(value);

          if (valueIsList) {
            let index = 0;

            for (const item of value as File[]) {
              const itemClone = recurse(item, `${pathPrefix}${index++}`, recursedDeeper);

              if (uncloned) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                clone.push(itemClone);
              }
            }
          } else {
            // eslint-disable-next-line guard-for-in
            for (const key in value) {
              const propertyClone = recurse(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                value[key],
                pathPrefix + key,
                recursedDeeper
              );

              if (uncloned) {
                clone[key] = propertyClone;
              }
            }
          }
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return clone;
      }

      return value as ApolloBody;
    };

    return {
      clone: recurse(body, realpath, new Set()),
      files
    };
  },
}
