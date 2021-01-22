<template>
  <div class="user_list-page flexC">
    <div class="pageContent flexC">
      <Form ref="formInline" :model="formInline" inline :label-width="5">
        <FormItem>
          <Input type="text" v-model="formInline.user" placeholder="请输入账号" style="width: 280px"></Input>
        </FormItem>
        <FormItem>
          <Select
            filterable
            clearable
            style="width: 280px"
            placeholder="请选择角色"
            ref="roleSelect"
            @on-change="getRoleId"
          >
            <Option
              v-for="item in formInline.roleList"
              :value="item.value"
              :key="item.value"
              v-if="!item.disabled"
            >{{ item.name }}</Option>
          </Select>
        </FormItem>
        <Button type="primary" icon="ios-search" @click="search" :loading="loading">查询</Button>
        <Button icon="ios-redo" @click="redo">重置</Button>
      </Form>
    </div>
    <div class="table_tools">
      <Button type="info" @click="batchChangeStatus(1)">批量启用</Button>
      <Button type="warning" @click="batchChangeStatus(0)">批量停用</Button>
      <Button type="error" @click="delUser">批量删除</Button>
      <Button type="success" @click="addUser">添加用户</Button>
    </div>
    <div>
      <Table border ref="selection" :columns="columns" :data="table.data.result" :loading="loading"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="table.count" :current="table.page" @on-change="changePage"></Page>
        </div>
      </div>
    </div>
    <Modal v-model="modal.show" mask :maskClosable="false" :title="modal.title" width="420px">
      <div class="pageContent flexC">
        <Form ref="modal" :model="modal" :rules="checkForm" :label-width="100">
          <FormItem label="用户名" prop="userName">
            <Input v-model="modal.userName" placeholder="请输入用户名">
              <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem label="姓名" prop="nickName">
            <Input v-model="modal.nickName" placeholder="请输入姓名">
              <Icon type="ios-person-add-outline" slot="prepend" />
            </Input>
          </FormItem>
          <FormItem label="手机号码" prop="phone">
            <Input v-model="modal.phone" placeholder="请输入手机号码" maxlength="11">
              <Icon type="ios-phone-portrait" slot="prepend" />
            </Input>
          </FormItem>
          <FormItem label="邮箱" prop="email">
            <Input v-model="modal.email" placeholder="请输入邮箱">
              <Icon type="ios-at-outline" slot="prepend" />
            </Input>
          </FormItem>
          <FormItem label="密码" prop="password">
            <Input v-model="modal.password" placeholder="请输入密码" type="password">
              <Icon type="ios-lock-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem label="角色" prop="roleIdLits">
            <Select v-model="modal.roleIdLits" filterable multiple>
              <Option
                v-for="item in formInline.roleList"
                :value="item.value"
                :key="item.value"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="出生日期" prop="birthday">
            <DatePicker type="date" placeholder="请输入出生日期" v-model="modal.birthday"></DatePicker>
          </FormItem>

          <FormItem label="性别" prop="sex">
            <RadioGroup v-model="modal.sex">
              <Radio label="0">男</Radio>
              <Radio label="1">女</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="状态">
            <i-switch v-model="modal.status" size="large">
              <span slot="open">正常</span>
              <span slot="close">禁用</span>
            </i-switch>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="primary" @click="ok('modal')">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getRoles } from "@/api/role";
import {
  listUser,
  batchChangeUserStatus,
  queryByUserId,
  addUser,
  editUser,
  delUser
} from "@/api/user";

export default {
  data() {
    return {
      formInline: {
        user: "",
        roleId: "",
        roleList: []
      },
      table: {
        count: 0,
        page: 1,
        limit: 10,
        data: ""
      },
      modal: {
        title: "添加",
        show: false,
        uid: "",
        userName: "",
        nickName: "",
        phone: "",
        email: "",
        password: "",
        birthday: "",
        status: true,
        sex: "0",
        roleIdLits: []
      },
      checkForm: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        phone: [
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "手机号码格式不正确",
            trigger: "blur"
          }
        ],
        email: [
          {
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: "邮箱格式不正确",
            trigger: "blur"
          }
        ]
      },
      loading: false,
      columns: [
        {
          type: "selection",
          width: 55,
          align: "center"
        },
        {
          title: "ID",
          key: "id",
          width: 180,
          resizable: true
        },
        {
          title: "账号",
          key: "userName",
          sortable: true
        },
        {
          title: "姓名",
          key: "nickName"
        },
        {
          title: "角色",
          key: "role",
          width: 180,
          render: (h, params) => {
            const row = params.row;
            const color = row.role === null ? "warning" : "primary";
            const text = row.role === null ? "普通用户" : row.role;
            return h(
              "Tag",
              {
                props: {
                  color: color
                }
              },
              text
            );
          }
        },
        {
          title: "状态",
          key: "status",
          render: (h, params) => {
            const row = params.row;
            const color = row.status === 1 ? "success" : "error";
            const text = row.status === 1 ? "正常" : "禁用";
            return h(
              "Tag",
              {
                props: {
                  type: "dot",
                  color: color
                }
              },
              text
            );
          }
        },
        {
          title: "手机",
          key: "mobile"
        },
        {
          title: "平台账号",
          key: "uuid"
        },
        {
          title: "登陆次数",
          key: "loginCount",
          width: 100
        },
        {
          title: "最后登录时间",
          key: "lastLoginTime",
          width: 180
        },
        {
          title: "最后登录IP",
          key: "lastLoginIp"
        },
        {
          title: "操作",
          slot: "action",
          fixed: "right",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                props: {
                  type: "ios-create-outline",
                  size: 18
                },
                style: {
                  marginRight: "5px"
                },
                class: "action_hover",
                on: {
                  click: () => {
                    this.editUser(params.index);
                  }
                }
              }),
              h("Icon", {
                props: {
                  type: "ios-trash-outline",
                  size: 18
                },
                class: "action_hover",
                on: {
                  click: () => {
                    this.remove(params.index);
                  }
                }
              })
            ]);
          }
        }
      ]
    };
  },
  created() {
    this.getRoles();
    this.search();
  },
  mounted() {},
  computed: {},
  methods: {
    getRoles() {
      const res = getRoles().then(result => {
        this.formInline.roleList = result.data;
      });
    },
    search() {
      this.loading = true;
      let params = {
        page: this.table.page,
        limit: this.table.limit,
        userName: this.formInline.user,
        roleId: this.formInline.roleId
      };
      listUser(params)
        .then(result => {
          this.table.data = result.data;
          this.table.count = result.data.count;
          this.loading = false;
        })
        .catch(e => {
          console.error(e);
          this.loading = false;
        });
    },
    redo() {
      this.formInline.user = "";
      this.$refs.roleSelect.clearSingleSelect();
    },
    getRoleId(e) {
      this.formInline.roleId = e;
    },
    changePage(index) {
      this.table.page = index;
      this.search();
    },
    batchChangeStatus(type) {
      let selectList = this.$refs.selection.getSelection();
      if (selectList.length == 0) {
        this.$Message["error"]({
          background: true,
          content: "请最少选择一条记录"
        });
        return;
      }
      let uidList = [];
      selectList.forEach(element => {
        uidList.push(element.id);
      });
      let changeParams = {
        type,
        uidList
      };
      batchChangeUserStatus(changeParams).then(async result => {
        await this.search();
      });
    },
    delUser() {
      let selectList = this.$refs.selection.getSelection();
      if (selectList.length == 0) {
        this.$Message["error"]({
          background: true,
          content: "请最少选择一条记录"
        });
        return;
      }
      this.$Modal.confirm({
        title: "确认删除",
        onOk: async () => {
          let idList = [];
          let indexList = [];
          selectList.forEach(element => {
            idList.push(element.id);
            indexList.push(element.index);
          });
          await delUser(idList);
          indexList.forEach(index => {
            this.table.data.result.splice(index, 1);
          });
        },
        onCancel: () => {}
      });
    },
    addUser() {
      this.$refs["modal"].resetFields();
      this.modal.uid = "";
      this.modal.show = true;
      this.modal.title = "添加用户";
    },
    editUser(index) {
      this.$refs["modal"].resetFields();
      this.modal.show = true;
      this.modal.title = "编辑用户";
      let id = this.table.data.result[index].id;
      queryByUserId(id).then(result => {
        this.modal.uid = result.data.uid;
        this.modal.userName = result.data.userName;
        this.modal.nickName = result.data.nickName;
        this.modal.phone = result.data.mobile;
        this.modal.email = result.data.email;
        this.modal.birthday = result.data.birthday;
        this.modal.status = result.data.status;
        this.modal.sex = result.data.gender + "";
        result.data.roleUserInfoDtoList.forEach(data => {
          this.modal.roleIdLits.push(data.roleId);
        });
      });
    },
    remove(index) {
      this.$Modal.confirm({
        title: "确认删除",
        content: "",
        onOk: async () => {
          let idList = [];
          let id = this.table.data.result[index].id;
          idList.push(id);
          await delUser(idList);
          this.table.data.result.splice(index, 1);
        },
        onCancel: () => {}
      });
    },
    cancel() {
      this.modal.show = false;
    },
    ok(params) {
      this.$refs[params].validate(async valid => {
        if (valid) {
          if (this.modal.uid == "") {
            await addUser(this.modal);
          } else {
            await editUser(this.modal);
          }
          this.modal.show = false;
          this.search();
        } else {
          this.modal.show = true;
        }
      });
    }
  },
  watch: {},
  filters: {}
};
</script>

<style lang="less">
.user_list-page {
  .pageContent {
    padding-bottom: 0px;
    form {
      button {
        margin-left: 20px;
      }
      padding-top: 5px;
    }
  }
  .table_tools {
    height: 55px;
    background-color: #f8f8f9;
    border-style: solid;
    border-color: #dcdee2;
    border-width: 1px 1px 0px 1px;
    display: flex;
    align-items: center;
    button {
      margin-left: 15px;
      border-radius: 1px;
    }
  }
}
.action_hover:hover {
  font-weight: bold;
}
</style>
