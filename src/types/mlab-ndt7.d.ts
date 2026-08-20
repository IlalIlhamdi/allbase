declare module "@m-lab/ndt7" {
  export interface NDT7Config {
    server?: string;
    protocol?: "wss" | "ws";
    metadata?: Record<string, string>;
    loadbalancer?: string;
    clientRegistrationToken?: string;
    userAcceptedDataPolicy?: boolean;
    mlabDataPolicyInapplicable?: boolean;
    downloadworkerfile?: string;
    uploadworkerfile?: string;
  }

  export interface NDT7ServerLocation {
    city?: string;
    country?: string;
    metro?: string;
    latitude?: number;
    longitude?: number;
    [key: string]: unknown;
  }

  export interface NDT7ServerChoice {
    machine?: string;
    location?: NDT7ServerLocation;
    urls: {
      "wss://///ndt/v7/download"?: string;
      "wss://///ndt/v7/upload"?: string;
      "ws://///ndt/v7/download"?: string;
      "ws://///ndt/v7/upload"?: string;
      [key: string]: string | undefined;
    };
    [key: string]: unknown;
  }

  export interface NDT7ClientMeasurementData {
    ElapsedTime: number; // in seconds
    NumBytes: number;
    MeanClientMbps: number;
  }

  export interface NDT7TCPInfo {
    RTT?: number; // microseconds
    RTTVar?: number; // microseconds
    MinRTT?: number; // microseconds
    BytesAcked?: number;
    BytesReceived?: number;
    BytesSent?: number;
    [key: string]: unknown;
  }

  export interface NDT7BBRInfo {
    MinRTT?: number; // microseconds
    BW?: number;
    [key: string]: unknown;
  }

  export interface NDT7AppInfo {
    ElapsedTime?: number; // microseconds
    NumBytes?: number;
    [key: string]: unknown;
  }

  export interface NDT7ServerMeasurementData {
    TCPInfo?: NDT7TCPInfo;
    BBRInfo?: NDT7BBRInfo;
    AppInfo?: NDT7AppInfo;
    [key: string]: unknown;
  }

  export type NDT7MeasurementEvent =
    | {
        Source: "client";
        Data: NDT7ClientMeasurementData;
        Test?: string;
      }
    | {
        Source: "server";
        Data: NDT7ServerMeasurementData;
        Test?: string;
      };

  export interface NDT7CompleteEvent {
    LastClientMeasurement?: NDT7ClientMeasurementData;
    LastServerMeasurement?: NDT7ServerMeasurementData;
  }

  export interface NDT7UserCallbacks {
    error?: (err: string | Error) => void;
    serverDiscovery?: (event: { loadbalancer: URL }) => void;
    serverChosen?: (server: NDT7ServerChoice) => void;
    downloadStart?: (event: { ClientStartTime?: number }) => void;
    downloadMeasurement?: (event: NDT7MeasurementEvent) => void;
    downloadComplete?: (event: NDT7CompleteEvent) => void;
    uploadStart?: (event: { StartTime?: number; ExpectedEndTime?: number }) => void;
    uploadMeasurement?: (event: NDT7MeasurementEvent) => void;
    uploadComplete?: (event: NDT7CompleteEvent) => void;
  }

  export interface NDT7Client {
    discoverServerURLs: (
      config: NDT7Config,
      userCallbacks?: NDT7UserCallbacks
    ) => Promise<Record<string, string>>;
    downloadTest: (
      config: NDT7Config,
      userCallbacks: NDT7UserCallbacks,
      urlPromise: Promise<Record<string, string>>
    ) => Promise<number>;
    uploadTest: (
      config: NDT7Config,
      userCallbacks: NDT7UserCallbacks,
      urlPromise: Promise<Record<string, string>>
    ) => Promise<number>;
    test: (
      config: NDT7Config,
      userCallbacks: NDT7UserCallbacks
    ) => Promise<number>;
  }

  const ndt7: NDT7Client;
  export default ndt7;
}
