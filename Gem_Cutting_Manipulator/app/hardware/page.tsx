"use client"

import { ServoMonitor } from "@/components/servo-monitor"
import { HardwareStatusPanel } from "@/components/hardware-status-panel"
import { PageHeader } from "@/components/page-header"
import { BottomNav } from "@/components/bottom-nav"
import { useHardwareStatus } from "@/hooks/use-hardware-status"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HardwarePage() {
  const hardwareStatus = useHardwareStatus()

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-[1920px] mx-auto space-y-4">
        <PageHeader title="Hardware Monitoring" description="Real-time status of all hardware components" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Servo Monitoring */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Servo Motors (MG996R)</h3>
            <ServoMonitor servos={hardwareStatus.servos} />
          </Card>

          {/* System Hardware */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">System Components</h3>
            <HardwareStatusPanel status={hardwareStatus} />
          </Card>
        </div>

        {/* Detailed Tabs */}
        <Tabs defaultValue="esp32" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="esp32">ESP32 S3</TabsTrigger>
            <TabsTrigger value="rpi">Raspberry Pi</TabsTrigger>
            <TabsTrigger value="pca">PCA9685</TabsTrigger>
            <TabsTrigger value="power">Power Supply</TabsTrigger>
          </TabsList>

          <TabsContent value="esp32" className="mt-4">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">ESP32 S3 Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-lg font-medium">{hardwareStatus.esp32.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Uptime</p>
                  <p className="text-lg font-medium">{hardwareStatus.esp32.uptime}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Memory Usage</p>
                  <p className="text-lg font-medium">{hardwareStatus.esp32.memoryUsage}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">WiFi Signal</p>
                  <p className="text-lg font-medium">{hardwareStatus.esp32.wifiSignal} dBm</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="rpi" className="mt-4">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Raspberry Pi 4 Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-lg font-medium">{hardwareStatus.raspberryPi.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CPU Usage</p>
                  <p className="text-lg font-medium">{hardwareStatus.raspberryPi.cpuUsage}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Temperature</p>
                  <p className="text-lg font-medium">{hardwareStatus.raspberryPi.temperature}°C</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Memory</p>
                  <p className="text-lg font-medium">{hardwareStatus.raspberryPi.memoryUsage}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Disk Usage</p>
                  <p className="text-lg font-medium">{hardwareStatus.raspberryPi.diskUsage}%</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="pca" className="mt-4">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">PCA9685 Controller Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-lg font-medium">{hardwareStatus.pca9685.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">I2C Address</p>
                  <p className="text-lg font-medium font-mono">{hardwareStatus.pca9685.i2cAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">PWM Frequency</p>
                  <p className="text-lg font-medium">{hardwareStatus.pca9685.pwmFrequency} Hz</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="power" className="mt-4">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Power Supply Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">5V Rail Voltage</p>
                  <p className="text-lg font-medium">{hardwareStatus.powerSupply.voltage5v.toFixed(2)}V</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">5V Rail Current</p>
                  <p className="text-lg font-medium">{hardwareStatus.powerSupply.current5v.toFixed(2)}A</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">5V Rail Power</p>
                  <p className="text-lg font-medium">
                    {(hardwareStatus.powerSupply.voltage5v * hardwareStatus.powerSupply.current5v).toFixed(2)}W
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">20V Rail Voltage</p>
                  <p className="text-lg font-medium">{hardwareStatus.powerSupply.voltage20v.toFixed(2)}V</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">20V Rail Current</p>
                  <p className="text-lg font-medium">{hardwareStatus.powerSupply.current20v.toFixed(2)}A</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">20V Rail Power</p>
                  <p className="text-lg font-medium">
                    {(hardwareStatus.powerSupply.voltage20v * hardwareStatus.powerSupply.current20v).toFixed(2)}W
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  )
}
