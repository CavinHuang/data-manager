<?php

namespace app\model;

use think\facade\Db;

class Query extends BaseModel
{
    public static function createDataTable($query_id, $fields = [])
    {
        $sql = "CREATE TABLE `sa_query_data_${query_id}` (";
        $sql .= "`id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',";
        foreach ($fields as $item) {
            $sql .= "`${item['field']}` varchar(500) NOT NULL COMMENT '${item['label']}',";
        }
        $sql .= "`is_deleted` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否是删除',";
        $sql .= "`status` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '1被禁用',";
        $sql .= "`createtime` int(11) NOT NULL DEFAULT '0' COMMENT '创建时间',";
        $sql .= "`updatetime` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '修改时间',";
        $sql .= "PRIMARY KEY (`id`)";
        $sql .= ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;";
        return Db::execute($sql);
    }

    public static function dropDataTable($table) {
        $sql = "DROP TABLE IF EXISTS " . $table;
        return Db::execute($sql);
    }
}