import autocannon from 'autocannon';

async function runBenchmark(name, url, connections = 20, duration = 8) {
  console.log(`\n========================================`);
  console.log(`🚀 Benchmarking: ${name}`);
  console.log(`URL: ${url} | Connections: ${connections} | Duration: ${duration}s`);
  console.log(`========================================`);

  return new Promise((resolve, reject) => {
    const instance = autocannon({
      url,
      connections,
      duration,
      pipelining: 1,
      headers: {
        'Accept': 'application/json',
      },
    }, (err, results) => {
      if (err) return reject(err);
      
      console.log(`\n--- ${name} Results ---`);
      console.log(`Total Requests:    ${results.requests.total}`);
      console.log(`Req/Sec (RPS):     ${results.requests.average.toFixed(2)} (Max: ${results.requests.max})`);
      console.log(`Latency Avg:       ${results.latency.average.toFixed(2)} ms`);
      console.log(`Latency P50:       ${results.latency.p50} ms`);
      console.log(`Latency P90:       ${results.latency.p90} ms`);
      console.log(`Latency P99:       ${results.latency.p99} ms`);
      console.log(`Latency Max:       ${results.latency.max} ms`);
      console.log(`Throughput/Sec:    ${(results.throughput.average / 1024 / 1024).toFixed(2)} MB/s`);
      console.log(`Errors / Non-2xx:  ${results.errors + results.non2xx}`);

      resolve({
        name,
        url,
        connections,
        duration,
        totalRequests: results.requests.total,
        rps: parseFloat(results.requests.average.toFixed(2)),
        latencyAvg: parseFloat(results.latency.average.toFixed(2)),
        latencyP50: results.latency.p50,
        latencyP90: results.latency.p90,
        latencyP99: results.latency.p99,
        latencyMax: results.latency.max,
        throughputMB: parseFloat((results.throughput.average / 1024 / 1024).toFixed(2)),
        errors: results.errors + results.non2xx,
      });
    });

    autocannon.track(instance, { renderProgressBar: false });
  });
}

async function main() {
  console.log("⚡ Starting Comprehensive Go API vs Next.js Fullstack Performance Benchmark ⚡\n");

  const results = [];

  // 1. Warm-up
  console.log("🔥 Warming up endpoints & DB connection pools...");
  try {
    await fetch('http://localhost:8080/api/products');
    await fetch('http://localhost:3001/api/products');
    await fetch('http://localhost:8080/api/categories');
    await fetch('http://localhost:3001/api/categories');
  } catch (e) {
    console.warn("Warmup notice:", e.message);
  }

  // 2. Products Endpoint: Concurrency 10 (Light Traffic)
  results.push(await runBenchmark("Go Gin API - Products (10 Conns)", "http://localhost:8080/api/products", 10, 6));
  results.push(await runBenchmark("Next.js Fullstack - Products (10 Conns)", "http://localhost:3001/api/products", 10, 6));

  // 3. Products Endpoint: Concurrency 50 (Moderate Load)
  results.push(await runBenchmark("Go Gin API - Products (50 Conns)", "http://localhost:8080/api/products", 50, 6));
  results.push(await runBenchmark("Next.js Fullstack - Products (50 Conns)", "http://localhost:3001/api/products", 50, 6));

  // 4. Products Endpoint: Concurrency 100 (Heavy Burst Load)
  results.push(await runBenchmark("Go Gin API - Products (100 Conns)", "http://localhost:8080/api/products", 100, 6));
  results.push(await runBenchmark("Next.js Fullstack - Products (100 Conns)", "http://localhost:3001/api/products", 100, 6));

  // 5. Categories Endpoint: Concurrency 50
  results.push(await runBenchmark("Go Gin API - Categories (50 Conns)", "http://localhost:8080/api/categories", 50, 6));
  results.push(await runBenchmark("Next.js Fullstack - Categories (50 Conns)", "http://localhost:3001/api/categories", 50, 6));

  console.log("\n\n=========================================================================================================");
  console.log("📊 FINAL BENCHMARK SUMMARY TABLE");
  console.log("=========================================================================================================");
  console.table(results.map(r => ({
    "Test Scenario": r.name,
    "Conns": r.connections,
    "RPS (Req/s)": r.rps,
    "Avg Latency": `${r.latencyAvg} ms`,
    "P50": `${r.latencyP50} ms`,
    "P90": `${r.latencyP90} ms`,
    "P99": `${r.latencyP99} ms`,
    "Throughput": `${r.throughputMB} MB/s`,
    "Errors": r.errors,
  })));
}

main().catch(console.error);
