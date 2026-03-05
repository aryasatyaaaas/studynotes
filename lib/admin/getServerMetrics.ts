import os from "os"
import { execSync } from "child_process"

export async function getServerMetrics() {
    const totalMem = os.totalmem()
    const freeMem = os.freemem()
    const usedMem = totalMem - freeMem

    const cpuPercent = await getCpuUsage()

    let diskPercent = 0, diskUsedGB = "0", diskTotalGB = "0"
    try {
        if (process.platform === "win32") {
            const out = execSync("wmic logicaldisk get size,freespace", { encoding: "utf8" })
            const lines = out.trim().split("\n").filter(l => l.trim() && !l.startsWith("FreeSpace"))
            if (lines.length > 0) {
                const parts = lines[0].trim().split(/\s+/)
                const free = parseInt(parts[0])
                const total = parseInt(parts[1])
                const used = total - free
                diskPercent = Math.round((used / total) * 100)
                diskUsedGB = (used / 1024 ** 3).toFixed(1)
                diskTotalGB = (total / 1024 ** 3).toFixed(1)
            }
        } else {
            const out = execSync("df -BG / | tail -1", { encoding: "utf8" })
            const parts = out.trim().split(/\s+/)
            diskPercent = parseInt(parts[4])
            diskUsedGB = parts[2].replace("G", "")
            diskTotalGB = parts[1].replace("G", "")
        }
    } catch {
        // fallback
    }

    return {
        cpuPercent: Math.round(cpuPercent),
        ramPercent: Math.round((usedMem / totalMem) * 100),
        ramUsedGB: (usedMem / 1024 ** 3).toFixed(1),
        ramTotalGB: (totalMem / 1024 ** 3).toFixed(1),
        diskPercent,
        diskUsedGB,
        diskTotalGB,
        uptime: formatUptime(os.uptime()),
        platform: `${os.type()} ${os.release()}`,
        cpuModel: os.cpus()[0]?.model ?? "Unknown",
        cpuCores: os.cpus().length,
        nodeVersion: process.version,
        loadAvg: os.loadavg().map(l => l.toFixed(2)),
    }
}

function getCpuUsage(): Promise<number> {
    return new Promise(resolve => {
        const start = os.cpus()
        setTimeout(() => {
            const end = os.cpus()
            let idle = 0, total = 0
            end.forEach((cpu, i) => {
                const types = Object.keys(cpu.times) as Array<keyof typeof cpu.times>
                types.forEach(type => {
                    total += cpu.times[type] - start[i].times[type]
                })
                idle += cpu.times.idle - start[i].times.idle
            })
            resolve(total > 0 ? 100 - (idle / total) * 100 : 0)
        }, 100)
    })
}

function formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    if (days > 0) return `${days}d ${hours}h ${mins}m`
    if (hours > 0) return `${hours}h ${mins}m`
    return `${mins}m`
}
