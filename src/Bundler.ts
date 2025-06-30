import path from "node:path";
import { fileURLToPath } from "node:url";
import webpack, {
  type Configuration,
  type RuleSetRule,
  type Stats,
  type Watching,
} from "webpack";
import type { InitializedOption, Option } from "./Option.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface BundlerSet {
  bundleDevelopment: () => Promise<void | Error>;
  watchBundle: () => Watching;
}

interface TsRuleOptions {
  configFile?: string;
  compilerOptions?: {
    target?: string;
    module?: string;
    moduleResolution?: string;
  };
}

export async function getBundlerSet(
  option: InitializedOption,
): Promise<BundlerSet> {
  const config: Configuration = await loadWebpackConfig(option);
  overrideTsConfigPath(config);
  overrideTsTarget(config, option.compileTarget);
  overrideTsModule(config, option.compileModule);
  overrideTsModuleResolution(config, option.compileModuleResolution);
  overrideRules(config, option);
  checkEntries(config, option);

  const watchOption: Configuration = { ...config, mode: "development" };
  overrideSourceMap(watchOption, "eval-cheap-source-map");

  return {
    bundleDevelopment: generateBundleDevelopment(config),
    watchBundle: () => {
      return webpack(watchOption).watch({}, (_err, stats) => {
        handleStats(stats);
      });
    },
  };
}

const generateBundleDevelopment = (
  config: Configuration,
): (() => Promise<void | Error>) => {
  return () => {
    return new Promise<void | Error>((resolve, reject) => {
      webpack(config, (_err, stats) => {
        handleStats(stats);
        if (stats?.hasErrors()) {
          reject(new Error("demo script build failed."));
        } else {
          resolve();
        }
      });
    });
  };
};

const loadWebpackConfig = async (option: Option): Promise<Configuration> => {
  const configPath = path.resolve(__dirname, "../webpack.config.js");
  const webpackConfigGenerator = await import(configPath);
  return webpackConfigGenerator.default(
    option.srcDir,
    option.distDir,
    option.prefix,
  );
};

/**
 * ts-loader用設定ファイルパスを、webpack.config.jsに注入する。
 *
 * @param config
 */
const overrideTsConfigPath = (config: Configuration) => {
  const tsRule: RuleSetRule = getTypeScriptRule(config);
  if (!tsRule) return;

  (tsRule.options as TsRuleOptions).configFile = path.resolve(
    __dirname,
    "../tsconfig.page.json",
  );
};

const getTypeScriptRule = (config: Configuration): RuleSetRule => {
  const rules = config.module?.rules as RuleSetRule[];
  return rules.find((rule) => {
    return rule.loader === "ts-loader";
  }) as RuleSetRule;
};

const checkTsRule = (
  config: Configuration,
  param?: any,
): TsRuleOptions | undefined => {
  if (param == null) return;
  const tsRule = getTypeScriptRule(config);
  if (!tsRule) return;

  const option = tsRule.options as TsRuleOptions;
  option.compilerOptions ??= {};
  return option;
};

const overrideTsTarget = (config: Configuration, target?: string) => {
  const option = checkTsRule(config, target);
  if (option) {
    option.compilerOptions!.target = target;
  }
};

const overrideTsModule = (config: Configuration, module?: string) => {
  const option = checkTsRule(config, module);
  if (option) {
    option.compilerOptions!.module = module;
  }
};

const overrideTsModuleResolution = (
  config: Configuration,
  moduleResolution?: string,
) => {
  const option = checkTsRule(config, moduleResolution);
  if (option) {
    option.compilerOptions!.moduleResolution = moduleResolution;
  }
};

const overrideRules = (config: Configuration, option: InitializedOption) => {
  config.module?.rules?.push(...option.rules);
};

const overrideSourceMap = (
  config: Configuration,
  sourceMap: string | false | undefined,
) => {
  config.devtool = sourceMap;
};

/**
 * webpack.config.jsのentryが正常に設定されているかを確認する。
 *
 * @param config
 * @param option
 */
const checkEntries = (config: Configuration, option: InitializedOption) => {
  if (Object.entries(config.entry as string | string[]).length === 0) {
    console.error(
      `gulptask-demo-page : webpackの対象となるデモページスクリプトが存在しません。\n
      ${option.distDir}ディレクトリ内にプレフィックス${option.prefix}で始まるJavaScriptファイルが存在するか確認してください。`,
    );
  }
};

/**
 * 成功メッセージ、もしくはエラーメッセージをコンソール出力する。
 * @param stats
 */
const handleStats = (stats?: Stats) => {
  if (stats == null) return;
  if (stats.hasErrors()) {
    stats.compilation.errors.forEach((err) => {
      console.log(err.message);
    });
    return;
  }
  console.log(
    "'gulptask-demo-page' process time : " +
      (stats.endTime - stats.startTime) +
      " ms",
  );
};
