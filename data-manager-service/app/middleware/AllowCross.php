<?php
declare (strict_types = 1);

namespace app\middleware;

use think\exception\HttpResponseException;
use think\facade\Log;
use think\Response;

class AllowCross
{
    /**
     * 处理请求
     *
     * @param \think\Request $request
     * @param \Closure       $next
     * @return Response
     */
    public function handle($request, \Closure $next)
    {
        Log::info('ceshi ssss');
        header('Access-Control-Allow-Origin: http://localhost:8080');
        header('Access-Control-Max-Age: 1800');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, If-Match, If-Modified-Since, If-None-Match, If-Unmodified-Since, X-CSRF-TOKEN, X-Requested-With, Token, sourcetype');
        if (strtoupper($request->method()) == "OPTIONS") {
            Log::info('ceshi ssss');
            throw new HttpResponseException(Response::create('success'));
        }
        return $next($request);
    }
}
