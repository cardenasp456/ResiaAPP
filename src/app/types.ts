export interface LoginInterface {
    email: string,
    password: string
    device: string
}

export interface InterceptorLogInterface {
    id: number;
    user_id: number;
    endpoint: string;
    method: string;
    url_origin: string;
    compilation: string;
    browser: string;
    browser_version: string;
    device: string;
    device_type: string;
    orientation: string;
    os: string;
    os_version: string;
    app_version: string;
    description: string;
    token: string;
    request: string;
    module_origin: any;
    endpoint_new: string;
    action: string;
}

export interface ChangePasswordInterface {
    new_password: string
}

export interface WordsDictionaryInterface {
    [key: string]: string[];
}

export interface DynamicContentInterface
{
    id?: number;
    title?: string;
    subtitle?: string;
    main_content?: string;
    special_content?: string;
}