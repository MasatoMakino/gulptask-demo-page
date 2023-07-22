import { webpack, Configuration, RuleSetRule, Watching, Stats } from "webpack";
import { Option } from "./Option";
import path from "path";

interface BundlerSet {
  bundleDevelopment: () => Promise<void | Error>;
  watchBundle: () => Watching;
}

interface TsRuleOptions {
  configFile?: string;
  compilerOptions?: {
    target?: string;
  };
}

export function getBundlerSet(option: Option): BundlerSet {
  const config: Configuration = loadWebpackConfig(option);
  overrideTsConfigPath(config);
  overrideTsTarget(config, option.compileTarget);
  overrideRules(config, option);
  checkEntries(config, option);

  const watchOption: Configuration = { ...config, mode: "development" };
  return {
    bundleDevelopment: generateBundleDevelopment(config),
    watchBundle: () => {
      return webpack(watchOption).watch({}, (err, stats) => {
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
      webpack(config, (err, stats) => {
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

const loadWebpackConfig = (option: Option): Configuration => {
  const configPath = path.resolve(__dirname, "../webpack.config.js");
  return require(configPath)(option.srcDir, option.distDir, option.prefix);
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
  return config.module?.rules?.find((rule: RuleSetRule) => {
    return rule.loader === "ts-loader";
  }) as RuleSetRule;
};

const overrideTsTarget = (config: Configuration, target?: string) => {
  if (target == null) return;

  const tsRule = getTypeScriptRule(config);
  if (!tsRule) return;

  (tsRule.options as TsRuleOptions).compilerOptions ??= {};
  (tsRule.options as TsRuleOptions).compilerOptions.target = target;
};

const overrideRules = (config: Configuration, option: Option) => {
  config.module.rules.push(...option.rules);
};

/**
 * webpack.config.jsのentryが正常に設定されているかを確認する。
 *
 * @param config
 * @param option
 */
const checkEntries = (config: Configuration, option: Option) => {
  if (Object.entries(config.entry).length === 0) {
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
